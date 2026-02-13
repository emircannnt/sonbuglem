import zipfile
import xml.etree.ElementTree as ET
import glob
import os

def extract_text(filename):
    document_xml_path = 'word/document.xml'
    with zipfile.ZipFile(filename) as docx:
        xml_content = docx.read(document_xml_path)
    
    tree = ET.fromstring(xml_content)
    
    # Namespaces usually used in docx
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    text_content = []
    for p in tree.findall('.//w:p', namespaces):
        texts = [node.text for node in p.findall('.//w:t', namespaces) if node.text]
        if texts:
            line = ''.join(texts).strip()
            if line:
                text_content.append(line)
                
    return text_content

files = glob.glob('*.docx')
if not files:
    print("No docx file found.")
else:
    target_file = '1001 HADİS.docx' 
    if target_file in files:
        hadiths = extract_text(target_file)
        # Limit to first 20 for preview to verify structure
        print(f"Total lines found: {len(hadiths)}")
        for i, h in enumerate(hadiths[:20]):
            print(f"{i+1}: {h}")
    else:
        print(f"File {target_file} not found.")
