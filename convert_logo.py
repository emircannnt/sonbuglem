
import base64
import os

try:
    with open('logo.png', 'rb') as f:
        data = f.read()
        b64 = base64.b64encode(data).decode('utf-8')
        
    js_content = f'const LOGO_BASE64 = "data:image/png;base64,{b64}";'
    
    with open('js/logo-data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("Successfully created js/logo-data.js")
except Exception as e:
    print(f"Error: {e}")
