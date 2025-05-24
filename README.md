# 🔍 ImgReader - Intelligent Invoice OCR Processor

<div align="center">
  
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tesseract.js](https://img.shields.io/badge/Tesseract.js-FF6B6B?style=for-the-badge&logo=javascript&logoColor=white)](https://tesseract.projectnaptha.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

_Automatically extract and process invoice data from images using advanced OCR technology_

[🚀 Live Demo](#demo) • [📖 Documentation](#documentation) • [🛠 Installation](#installation) • [🤝 Contributing](#contributing)

</div>

---

## ✨ Features

### 🎯 **Smart Data Extraction**

- **🏢 Service Provider Recognition** - Automatically identifies mechanic shops and service centers
- **🚗 License Plate Detection** - Supports multiple Hungarian license plate formats (AA-BB-12, ABC-12, A-BB-12, AA-B-12)
- **💰 Cost Extraction** - Precisely extracts final amounts from invoices
- **📋 Form Auto-Fill** - Instantly populates forms with extracted data

### 🔧 **Advanced OCR Processing**

- **🌐 Multi-language Support** - Optimized for Hungarian text recognition
- **📊 Real-time Progress** - Live progress tracking during OCR processing
- **🖼️ Flexible Input** - Drag & drop or click to upload images
- **⚡ Fast Processing** - Powered by Tesseract.js for reliable text recognition

### 🎨 **User Experience**

- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🔄 Live Preview** - See extracted data instantly
- **✏️ Editable Fields** - Manual correction of auto-extracted data
- **🎯 Smart Validation** - Built-in data validation and error handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- Modern web browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/akosszanto/imgreader.git

# Navigate to project directory
cd imgreader

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🎮 Usage

### 1. **Upload Invoice Image**

- Drag and drop an image file onto the upload area
- Or click the upload area to select a file
- Supported formats: JPG, PNG, WEBP, BMP

### 2. **Process with OCR**

- Click "Feldolgozás indítása" (Start Processing)
- Watch the real-time progress indicator
- OCR will automatically extract text from the image

### 3. **Review & Edit**

- Auto-extracted data appears in the form fields
- Edit any field manually if needed
- Submit the completed form

---

## 🏗️ Architecture

### Supported Service Providers

```javascript
✅ Angel Pine Junkyard Auto Service
✅ Boxter Mechanic Shop
✅ Fix & Drive Mechanic Shop
✅ SeeRing services
```

### License Plate Formats

```regex
AA-BB-12  // Standard format
ABC-12    // Short format
A-BB-12   // Single letter prefix
AA-B-12   // Single letter middle
```

### Data Extraction Pipeline

```
Image Upload → OCR Processing → Text Analysis → Data Extraction → Form Population
```

---

## 🔧 Configuration

### OCR Settings

The OCR engine is configured for optimal Hungarian text recognition:

```javascript
const ocrConfig = {
  language: "hun",
  progressCallback: true,
  errorHandling: "graceful",
};
```

### Extraction Patterns

Customize regex patterns for different invoice formats:

```javascript
const patterns = {
  finalAmount: /Végösszeg:\s*([\d\s]+)\s*\$/i,
  licensePlate: /[A-Z]{2}-[A-Z]{2}-\d{2}/g,
  serviceProvider: /Angel Pine|Boxter|Fix & Drive|SeeRing/i,
};
```

---

## 🛠️ Development

### Project Structure

```
imgreader/
├── src/
│   ├── components/
│   │   └── OcrForm.jsx
|   |   └── Form.css
│   ├── styles/
│   │
│   └── App.jsx
├── public/
└── package.json
```

### Key Components

#### `OcrForm.jsx`

The main component handling:

- File upload and validation
- OCR processing with Tesseract.js
- Data extraction and parsing
- Form state management

#### Core Functions

- `findKiallito()` - Service provider identification
- `extractData()` - Invoice data extraction
- `handleProcessClick()` - OCR processing workflow

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Tesseract.js](https://tesseract.projectnaptha.com/)** - Powerful OCR engine
- **[React](https://reactjs.org/)** - UI framework
- **Contributors** - Thanks to all who helped improve this project

---

<div align="center">

**Made with ❤️ by [Ákos Szántó](https://github.com/akosszanto)**

⭐ Star this project if you find it useful!

</div>
