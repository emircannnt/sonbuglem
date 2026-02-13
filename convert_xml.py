import xml.etree.ElementTree as ET
import json
import os

def parse_quran_data():
    try:
        # Load XMLs
        tree_quran = ET.parse('quran-uthmani.xml')
        root_quran = tree_quran.getroot()
        
        tree_trans = ET.parse('tr.yazir.xml')
        root_trans = tree_trans.getroot()
        
        quran_json = []

        # Iterate Surahs
        for sura_idx, sura in enumerate(root_quran.findall('sura')):
            sura_index = sura.get('index')
            sura_name = sura.get('name')
            
            # Find corresponding translation surah
            # Assuming strictly ordered and matching indices, but let's be safe
            trans_sura = root_trans.find(f".//sura[@index='{sura_index}']")
            
            ayas = []
            for aya_idx, aya in enumerate(sura.findall('aya')):
                aya_index = aya.get('index')
                arabic_text = aya.get('text')
                
                trans_text = "Çeviri bulunamadı."
                if trans_sura:
                    trans_aya = trans_sura.find(f".//aya[@index='{aya_index}']")
                    if trans_aya is not None:
                        trans_text = trans_aya.get('text')
                
                ayas.append({
                    "i": int(aya_index),
                    "a": arabic_text,
                    "t": trans_text
                })
            
            quran_json.append({
                "id": int(sura_index),
                "name": sura_name,
                "ayahs": ayas
            })

        # Write to JS file
        js_content = f"const quranData = {json.dumps(quran_json, ensure_ascii=False)};\n"
        js_content += "if (typeof module !== 'undefined' && module.exports) { module.exports = quranData; } else { window.quranData = quranData; }"
        
        with open('js/quran-data.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print("Successfully created js/quran-data.js")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parse_quran_data()
