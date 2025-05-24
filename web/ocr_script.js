function findKiallito(text) {
    const kiallitok = [
        "Angel Pine Junkyard Auto Service",
        "Boxter Mechanic Shop",
        "Fix & Drive Mechanic Shop",
        "SeeRing services"
    ];

    const textNormalized = text.toLowerCase().replace(/\s+/g, ' ');

    for (let kiallito of kiallitok) {
        const kiallito_normalized = kiallito.toLowerCase().replace(/\s+/g, ' ');

        if (textNormalized.includes(kiallito_normalized)) {
            return kiallito;
        }

        const kiallito_words = kiallito_normalized.split(' ');
        let found_words = 0;

        for (let word of kiallito_words) {
            if (textNormalized.includes(word)) {
                found_words++;
            }
        }

        if (kiallito_words.length > 0 && found_words / kiallito_words.length >= 0.6) {
            return kiallito;
        }
    }

    const lines = text.split('\n');
    for (let line of lines) {
        const lineClean = line.trim().toLowerCase();
        if (lineClean.includes('junkyard') || lineClean.includes('mechanic') ||
            lineClean.includes('services') || lineClean.includes('shop')) {
            return line.trim();
        }
    }

    return null;
}

function extractData(text) {
    console.log('OCR eredmény:', text);

    // Kiállító keresése
    const kiallito = findKiallito(text);

    // Végösszeg keresése
    const vegosszegMatch = text.match(/Végösszeg:\s*([\d\s]+\$?)/i);
    let vegosszeg = null;
    if (vegosszegMatch) {
        vegosszeg = vegosszegMatch[1].trim().replace(/\s/g, '').replace('$', '');
    }

    // Forgalmi rendszám keresése
    const forgalmiMatch = text.match(/[A-Z]{2}-[A-Z]{2}-\d{2}/);
    const forgalmi = forgalmiMatch ? forgalmiMatch[0] : null;

    return {
        kiallito: kiallito || "Nem található",
        vegosszeg: vegosszeg,
        forgalmirsz: forgalmi
    };
}

// UI elemek
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const kiaillitoResult = document.getElementById('kiaillitoResult');
const vegosszegResult = document.getElementById('vegosszegResult');
const forgalmiResult = document.getElementById('forgalmiResult');
const jsonOutput = document.getElementById('jsonOutput');

let selectedFile = null;

// Drag & Drop és fájl kiválasztás
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Csak képfájlokat lehet feltölteni!');
        return;
    }

    selectedFile = file;

    // Kép előnézet
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewSection.classList.remove('hidden');
        processBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// OCR feldolgozás
processBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    progressSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    processBtn.disabled = true;

    try {
        const result = await Tesseract.recognize(
            selectedFile,
            'hun',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        progressFill.style.width = progress + '%';
                        progressText.textContent = `Szöveg felismerése... ${progress}%`;
                    }
                }
            }
        );

        const extractedData = extractData(result.data.text);
        displayResults(extractedData);

    } catch (error) {
        console.error('OCR hiba:', error);
        alert('Hiba történt a feldolgozás során: ' + error.message);
    } finally {
        progressSection.classList.add('hidden');
        processBtn.disabled = false;
    }
});

function displayResults(data) {
    kiaillitoResult.textContent = data.kiallito;
    vegosszegResult.textContent = data.vegosszeg || 'Nem található';
    forgalmiResult.textContent = data.forgalmirsz || 'Nem található';

    jsonOutput.textContent = JSON.stringify(data, null, 2);

    resultsSection.classList.remove('hidden');
}