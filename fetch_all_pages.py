import urllib.request
import re
import json
import os

pages = {
    "home": "https://spiritualkarim.com/",
    "about": "https://spiritualkarim.com/about/",
    "faq": "https://spiritualkarim.com/faq/",
    "solution": "https://spiritualkarim.com/solution/",
    "sri_yantra_sadhana": "https://spiritualkarim.com/sri-yantra-sadhana/",
    "kalashtami_sadhana": "https://spiritualkarim.com/kalashtami-sadhana/",
    "navratri_sadhana": "https://spiritualkarim.com/navratri-sadhana-chamunda-mata/",
    "diwali_sadhana": "https://spiritualkarim.com/diwali-sadhana-week/",
    "trilok_nagri": "https://spiritualkarim.com/trilok-nagri-access/",
    "three_diya": "https://spiritualkarim.com/three-diya-process/",
    "court_cases": "https://spiritualkarim.com/court-cases-clove-cardamom-havan/",
    "business_money_finance": "https://spiritualkarim.com/business-money-finance-silver-diya-remedy/",
    "siddh_mantras": "https://spiritualkarim.com/siddh-mantras-for-mantra-jaap/",
    "negativity": "https://spiritualkarim.com/negativity/",
    "spiritual_progress": "https://spiritualkarim.com/spiritual-progress/",
    "material_benefits": "https://spiritualkarim.com/material-benefits/",
    "healing": "https://spiritualkarim.com/healing/",
    "course_information": "https://spiritualkarim.com/course-information/",
    "bakhoor": "https://spiritualkarim.com/bakhoor/"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
results = {}

for key, url in pages.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # extract text
            clean = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL | re.I)
            clean = re.sub(r'<style.*?</style>', '', clean, flags=re.DOTALL | re.I)
            clean = re.sub(r'<header.*?</header>', '', clean, flags=re.DOTALL | re.I)
            clean = re.sub(r'<footer.*?</footer>', '', clean, flags=re.DOTALL | re.I)
            clean = re.sub(r'<nav.*?</nav>', '', clean, flags=re.DOTALL | re.I)
            clean = re.sub(r'<[^>]+>', '\n', clean)
            lines = [l.strip() for l in clean.split('\n') if l.strip()]
            
            # extract title
            title_match = re.search(r'<title>(.*?)</title>', html, re.I)
            title = title_match.group(1) if title_match else key
            
            results[key] = {
                "url": url,
                "title": title,
                "lines": lines
            }
            print(f"Fetched {key}: {len(lines)} lines")
    except Exception as e:
        print(f"Error fetching {key}: {e}")

with open('all_pages_data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved all_pages_data.json successfully.")
