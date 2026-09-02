import gradio as gr
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re
import os
import zipfile
import io

def analyze_website(url):
    if not url:
        return "Please enter a valid URL.", "", "", "", None, ""
        
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
        
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except Exception as e:
        return f"Error fetching the website: {e}", "", "", "", None, ""

    html_content = response.text
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Extract Metadata
    metadata = {
        "Title": soup.title.string.strip() if soup.title else "N/A",
        "Meta Description": "",
        "Keywords": "",
        "OG Title": "",
        "OG Description": "",
        "OG Image": "",
        "Twitter Card": ""
    }
    
    desc_tag = soup.find('meta', attrs={'name': re.compile(r'description', re.I)})
    if desc_tag:
        metadata["Meta Description"] = desc_tag.get('content', '')
        
    keywords_tag = soup.find('meta', attrs={'name': re.compile(r'keywords', re.I)})
    if keywords_tag:
        metadata["Keywords"] = keywords_tag.get('content', '')
        
    for tag in soup.find_all('meta'):
        property_attr = tag.get('property', '')
        name_attr = tag.get('name', '')
        content_attr = tag.get('content', '')
        
        if property_attr == 'og:title':
            metadata["OG Title"] = content_attr
        elif property_attr == 'og:description':
            metadata["OG Description"] = content_attr
        elif property_attr == 'og:image':
            metadata["OG Image"] = content_attr
        elif name_attr == 'twitter:card':
            metadata["Twitter Card"] = content_attr

    # 2. Structure & Statistics
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    
    links = soup.find_all('a', href=True)
    internal_links = 0
    external_links = 0
    for link in links:
        href = link['href']
        link_domain = urlparse(href).netloc
        if not link_domain or link_domain == domain:
            internal_links += 1
        else:
            external_links += 1
            
    stats = {
        "Domain": domain,
        "Total Headings": len(soup.find_all(re.compile(r'^h[1-6]$'))),
        "Paragraphs (<p>)": len(soup.find_all('p')),
        "Divs (<div>)": len(soup.find_all('div')),
        "Buttons (<button>)": len(soup.find_all('button')),
        "Images (<img>)": len(soup.find_all('img')),
        "Forms (<form>)": len(soup.find_all('form')),
        "Links (<a>)": len(links),
        "  - Internal Links": internal_links,
        "  - External Links": external_links,
        "External Stylesheets": len(soup.find_all('link', rel='stylesheet')),
        "Inline Styles (<style>)": len(soup.find_all('style')),
        "Scripts (<script>)": len(soup.find_all('script'))
    }
    
    # 3. Extract Styles (Colors and Fonts)
    inline_styles = [s.string for s in soup.find_all('style') if s.string]
    inline_styles_text = "\n".join(inline_styles)
    
    # Simple color regex
    colors = set(re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\)', inline_styles_text))
    # Simple font regex
    fonts = set(re.findall(r'font-family:\s*([^;}]+)', inline_styles_text))
    
    extracted_styles = "### Colors Found (in inline styles):\n"
    if colors:
        extracted_styles += "\n".join([f"- `{c}`" for c in list(colors)[:20]])
    else:
        extracted_styles += "None detected in inline styles.\n"
        
    extracted_styles += "\n\n### Fonts Found (in inline styles):\n"
    if fonts:
        extracted_styles += "\n".join([f"- {f.strip()}" for f in list(fonts)[:10]])
    else:
        extracted_styles += "None detected in inline styles.\n"

    # 4. Extract UI & Layout Code (Cleaned HTML + Style Bundle)
    # Remove script tags to keep only UI structure
    for script in soup(["script", "noscript", "iframe"]):
        script.decompose()
        
    cleaned_html = soup.prettify()
    
    # Create downloadable zip package containing index.html and styles.css
    zip_path = "extracted_ui.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr("index.html", cleaned_html)
        zip_file.writestr("styles.css", inline_styles_text)

    # Metadata Formatted output
    meta_output = "### Metadata Insights\n" + "\n".join([f"- **{k}**: {v}" for k, v in metadata.items() if v])
    stats_output = "### Element Statistics\n" + "\n".join([f"- **{k}**: {v}" for k, v in stats.items()])
    
    # Screenshot iframe using Microlink embed
    screenshot_html = f'<iframe src="https://api.microlink.io?url={url}&screenshot=true&embed=screenshot.url" width="100%" height="450px" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>'
    
    return meta_output, stats_output, extracted_styles, cleaned_html[:60000], zip_path, screenshot_html

# Custom CSS for dark minimalist visualizer theme
custom_css = """
body {
    background-color: #0b0f19;
    color: #f1f5f9;
}
.gradio-container {
    max-width: 900px !important;
    margin: 0 auto;
}
"""

with gr.Blocks(theme=gr.themes.Soft(), css=custom_css) as demo:
    gr.Markdown("# 🌐 Web UI & Insight Extractor")
    gr.Markdown("Enter any website URL to extract visual/text insights, generate screenshots, and download its HTML/CSS UI skeleton layout.")
    
    with gr.Row():
        url_input = gr.Textbox(placeholder="https://example.com", label="Website URL")
        submit_btn = gr.Button("Analyze & Extract", variant="primary")
        
    with gr.Tabs():
        with gr.TabItem("📊 Website Insights"):
            with gr.Row():
                meta_col = gr.Markdown()
                stats_col = gr.Markdown()
                
        with gr.TabItem("🎨 Style Sheet Analysis"):
            style_col = gr.Markdown()
            
        with gr.TabItem("🖥️ Extracted UI Skeleton (HTML)"):
            gr.Markdown("Below is the structural HTML (scripts/iframes removed) ready for layout component cloning:")
            html_code = gr.Code(language="html", label="Cleaned UI DOM Code")
            download_btn = gr.File(label="Download UI Package (HTML & CSS ZIP)")
            
        with gr.TabItem("📸 Live Website Screenshot"):
            screenshot_output = gr.HTML()

    submit_btn.click(
        fn=analyze_website,
        inputs=[url_input],
        outputs=[meta_col, stats_col, style_col, html_code, download_btn, screenshot_output]
    )

if __name__ == "__main__":
    demo.launch()
