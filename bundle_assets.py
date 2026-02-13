import os
import base64
import re

# Paths
WEB_DIR = os.path.join("assets", "web")
INDEX_PATH = os.path.join(WEB_DIR, "index.html")
OUTPUT_PATH = os.path.join(WEB_DIR, "bundled_index.html")

def get_base64_image(img_path):
    """Encodes an image file to base64 string."""
    try:
        with open(img_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding image {img_path}: {e}")
        return ""

def inline_assets(html_content, base_dir):
    """Inlines CSS, JS, and Images into the HTML content."""
    
    # Inline CSS
    def replace_css(match):
        href = match.group(1)
        css_path = os.path.join(base_dir, href)
        if os.path.exists(css_path):
            with open(css_path, "r", encoding="utf-8") as f:
                return f"<style>\n{f.read()}\n</style>"
        return match.group(0)
    
    html_content = re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)">', replace_css, html_content)

    # Inline JS
    def replace_js(match):
        src = match.group(1)
        js_path = os.path.join(base_dir, src)
        if os.path.exists(js_path):
            with open(js_path, "r", encoding="utf-8") as f:
                # Escape script tags inside strings if any, to prevent early closing
                # For simple cases, just embedding usually works, but complex JS might need care.
                # using a simple embedding here.
                return f"<script>\n{f.read()}\n</script>"
        return match.group(0)

    html_content = re.sub(r'<script\s+src="([^"]+)"></script>', replace_js, html_content)

    # Inline Images (src="...")
    def replace_img(match):
        src = match.group(1)
        # Skip if already data URI or http
        if src.startswith("data:") or src.startswith("http"):
            return match.group(0)
            
        img_path = os.path.join(base_dir, src)
        if os.path.exists(img_path):
            ext = os.path.splitext(src)[1][1:].lower()
            mime_type = "image/png" if ext == "png" else "image/jpeg" # Default to jpeg/png
            if ext == "svg": mime_type = "image/svg+xml"
            if ext == "jpg": mime_type = "image/jpeg"
            
            b64_str = get_base64_image(img_path)
            return f'src="data:{mime_type};base64,{b64_str}"'
        return match.group(0)

    html_content = re.sub(r'src="([^"]+\.(?:png|jpg|jpeg|svg))"', replace_img, html_content)
    
    return html_content

def main():
    if not os.path.exists(INDEX_PATH):
        print(f"Error: {INDEX_PATH} not found.")
        return

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()

    bundled_html = inline_assets(html_content, WEB_DIR)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(bundled_html)

    print(f"Bundled HTML saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
