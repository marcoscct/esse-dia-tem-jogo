import urllib.request

def check_html():
    url = "https://www.essediatemjogo.com.br/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        print("Manifest link in HTML:", "manifest" in html)
        print("Apple touch icon in HTML:", "apple-touch-icon" in html)
        
        # Print lines containing manifest or apple-touch-icon
        for line in html.split('\n'):
            if 'manifest' in line or 'apple-touch-icon' in line or 'sw.js' in line:
                print("Matching line:", line.strip())
    except Exception as e:
        print("Error fetching:", e)

if __name__ == "__main__":
    check_html()
