import React, { useState, useRef, useCallback } from 'react';
import { recognize } from 'tesseract.js';
import './Form.css';

function findKiallito(text) {
    const kiallitok = [
        {
            names: ["Angel Pine Junkyard Auto Service", "Angel Pine Junkyard", "JUNKYARD"],
            result: "Angel Pine Junkyard Auto Service"
        },
        {
            names: ["Boxter Mechanic Shop", "Boxter Mechanic", "BMS-"],
            result: "Boxter Mechanic Shop"
        },
        {
            names: ["Fix & Drive Mechanic Shop", "Fix § Drive Mechanic Shop", "Fix and Drive", "FIX-"],
            result: "Fix & Drive Mechanic Shop"
        },
        {
            names: ["SeeRing services", "SeeRing", "RING-"],
            result: "SeeRing services"
        }
    ];

    const upperText = text.toUpperCase();
    
    for (let kiallito of kiallitok) {
        for (let name of kiallito.names) {
            if (upperText.includes(name.toUpperCase())) {
                return kiallito.result;
            }
        }
    }
    return null;
}

function extractData(text) {
    const kiallito = findKiallito(text);
    
    const vegosszegMatch = text.match(/Végösszeg:\s*([\d\s]+)\s*\$/i);
    const vegosszeg = vegosszegMatch ? vegosszegMatch[1].trim().replace(/\s/g, '') : null;
    
    const forgalmiPatterns = [
        /[A-Z]{1,3}-[A-Z]{1,3}-\d{2,3}/g,
        /[A-Z]{2,3}-\d{2,3}/g,
        /[A-Z]-[A-Z]{2}-\d{3}/g
    ];
    
    let forgalmi = null;
    for (let pattern of forgalmiPatterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            forgalmi = matches[0];
            break;
        }
    }
    
    return {
        kiallito: kiallito || "Nem található",
        vegosszeg: vegosszeg,
        forgalmirsz: forgalmi
    };
}

function OcrForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [ocrProgressText, setOcrProgressText] = useState('');
    const [formData, setFormData] = useState({
        tipus: 'Szereltetési költség',
        kiallito: '',
        rendszam: '',
        vegosszeg: '',
        megjegyzes: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Csak képfájlokat lehet feltölteni!');
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    }, []);

    const handleUploadAreaClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleProcessClick = async () => {
        if (!selectedFile || isProcessing) return;

        setIsProcessing(true);
        setOcrProgress(0);
        setOcrProgressText('Szöveg felismerése... 0%');

        try {
            const result = await recognize(selectedFile, 'hun', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        setOcrProgress(progress);
                        setOcrProgressText(`Szöveg felismerése... ${progress}%`);
                    }
                }
            });
            
            console.log('OCR eredmény:', result.data.text); // Debug logging
            
            const data = extractData(result.data.text);
            console.log('Kinyert adatok:', data); // Debug logging
            
            const newFormData = {
                ...formData,
                kiallito: data.kiallito || formData.kiallito,
                rendszam: data.forgalmirsz || formData.rendszam,
                vegosszeg: data.vegosszeg || formData.vegosszeg
            };
            
            console.log('Új form adatok:', newFormData); // Debug logging
            
            setFormData(newFormData);
        } catch (error) {
            console.error('OCR hiba:', error);
            alert('Hiba történt a feldolgozás során: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="form-container">
            <h1>Kérelem létrehozása</h1>

            <form>
                <label>Kérelem típusa</label>
                <select name="tipus" onChange={handleChange} value={formData.tipus || ''}>
                    <option value="Szereltetési költség">Szereltetési költség</option>
                </select>

                <label>Szereltetés helye</label>
                <input
                    type="text"
                    name="hely"
                    value={formData.kiallito || ''}
                    onChange={handleChange}
                />

                <label>Jármű rendszáma</label>
                <input
                    type="text"
                    name="rendszam"
                    value={formData.rendszam || ''}
                    onChange={handleChange}
                />

                <label>Számláról kép</label>
                <div
                    className="upload-area"
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {selectedFile ? selectedFile.name : 'Kattints ide vagy húzd ide a képet'}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                />

                <label>Költség</label>
                <input
                    type="text"
                    name="vegosszeg"
                    value={formData.vegosszeg || ''}
                    onChange={handleChange}
                />

                <label>Megjegyzés</label>
                <textarea
                    name="megjegyzes"
                    value={formData.megjegyzes || ''}
                    onChange={handleChange}
                ></textarea>

                {isProcessing && (
                    <div className="progress-section">
                        <div className="progress-bar" style={{ width: `${ocrProgress}%` }}></div>
                        <p>{ocrProgressText}</p>
                    </div>
                )}

                <button type="button" onClick={handleProcessClick} disabled={isProcessing}>
                    Feldolgozás indítása
                </button>
                <button type="submit">Létrehozás</button>
            </form>
        </div>
    );
}

export default OcrForm;