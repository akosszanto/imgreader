import pytesseract
from PIL import Image
import json
import re

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

image_path = "images/seering.png"
image = Image.open(image_path)

text = pytesseract.image_to_string(image, lang='hun') 

# Debug
#print("OCR eredmény:")
#print(text)
#print("-" * 50)

def find_kiallito(text):
    kiallitok = [
        "Angel Pine Junkyard Auto Service",
        "Boxter Mechanic Shop", 
        "Fix & Drive Mechanic Shop",
        "SeeRing services"
    ]
    
    # Szöveg normalizálása 
    text_normalized = ' '.join(text.lower().split())
    
    for kiallito in kiallitok:
        kiallito_normalized = ' '.join(kiallito.lower().split())
        
        # Pontos egyezés keresése
        if kiallito_normalized in text_normalized:
            return kiallito
        
        # Részleges egyezés keresése (OCR hibák miatt)
        kiallito_words = kiallito_normalized.split()
        found_words = 0
        
        for word in kiallito_words:
            if word in text_normalized:
                found_words += 1
        
        # Ha a szavak legalább 60%-a megtalálható
        if len(kiallito_words) > 0 and found_words / len(kiallito_words) >= 0.6:
            return kiallito
    
    # Ha nem találtuk meg, próbáljunk kulcsszavas keresést
    lines = text.split('\n')
    for line in lines:
        line_clean = line.strip().lower()
        if ('junkyard' in line_clean or 'mechanic' in line_clean or 
            'services' in line_clean or 'shop' in line_clean):
            return line.strip()
    
    return None

vegosszeg_pattern = r"Végösszeg:\s*([\d\s]+\$?)"
forgalmi_pattern = r"[A-Z]{2}-[A-Z]{2}-\d{2}"

kiallito_result = find_kiallito(text)

#Debug
#print(f"Kiállító keresés eredménye: {kiallito_result}")


vegosszeg = re.search(vegosszeg_pattern, text)
forgalmi = re.search(forgalmi_pattern, text)
vegosszeg_cleaned = None
if vegosszeg:
    vegosszeg_cleaned = vegosszeg.group(1).strip()
    vegosszeg_cleaned = vegosszeg_cleaned.replace(" ", "").replace("$", "")

# JSON
output = {
    "kiallito": kiallito_result if kiallito_result else "Nem található",
    "vegosszeg": vegosszeg_cleaned,
    "forgalmirsz": forgalmi.group(0) if forgalmi else None,
}

print("\nVégeredmény:")
print(json.dumps(output, ensure_ascii=False, indent=4))

# JSON mentése
json_path = "output.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=4)

print(f"\nAdatok mentve: {json_path}")