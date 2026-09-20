import sqlite3
import os
import requests
import urllib.parse
import difflib
import time
from database import get_db, DB_PATH

def is_title_match(college_name: str, wiki_title: str) -> bool:
    c_lower = college_name.lower()
    w_lower = wiki_title.lower()

    if "government engineering & polytechnic college" in c_lower:
        return False

    clean_c = c_lower.split('(')[0].replace(',', '').strip()
    clean_w = w_lower.split('(')[0].replace(',', '').strip()

    ratio = difflib.SequenceMatcher(None, clean_c, clean_w).ratio()
    if ratio >= 0.75:
        return True

    ignore = {'college', 'of', 'engineering', 'technology', 'and', 'institute', 'campus', 'autonomous', 'the'}
    c_tokens = set(clean_c.split()) - ignore
    w_tokens = set(clean_w.split()) - ignore

    if c_tokens and c_tokens.issubset(w_tokens):
        return True

    return False

def fetch_wikipedia_photo(college_name):
    try:
        clean_query = college_name.split("(")[0].split(",")[0].strip()
        search_api = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(clean_query)}&format=json"
        s_res = requests.get(search_api, timeout=6, headers={"User-Agent": "AscentiaAI/1.0 (contact@ascentia.ai)"}).json()
        search_results = s_res.get("query", {}).get("search", [])
        if not search_results:
            return None, None

        page_title = search_results[0]["title"]
        if not is_title_match(college_name, page_title):
            print(f"[SKIP MISMATCH] '{college_name}' vs Wiki page '{page_title}'")
            return None, None

        time.sleep(0.3)
        image_api = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(page_title)}&prop=pageimages&format=json&pithumbsize=600"
        i_res = requests.get(image_api, timeout=6, headers={"User-Agent": "AscentiaAI/1.0 (contact@ascentia.ai)"}).json()
        pages = i_res.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if "thumbnail" in page_data:
                img_src = page_data["thumbnail"]["source"]
                return img_src, "Photo: Wikimedia Commons"
    except Exception as e:
        print(f"Error fetching Wiki photo for {college_name}: {e}")
    return None, None

def update_college_photos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, location FROM colleges")
    colleges = cursor.fetchall()

    print(f"Processing photo links for {len(colleges)} colleges...")
    updated_count = 0

    for col in colleges:
        col_id, col_name = col["id"], col["name"]
        
        img_url, attr = fetch_wikipedia_photo(col_name)

        if img_url:
            cursor.execute("UPDATE colleges SET image_url = ?, photo_attribution = ? WHERE id = ?", (img_url, attr, col_id))
            updated_count += 1
            print(f"[OK PHOTO] {col_name} -> {img_url}")
        else:
            cursor.execute("UPDATE colleges SET image_url = NULL, photo_attribution = NULL WHERE id = ?", (col_id,))
            print(f"[FALLBACK INITIALS] {col_name}")

        time.sleep(0.4)

    conn.commit()
    conn.close()
    print(f"Photo update complete. {updated_count}/{len(colleges)} college photos saved in database.")

if __name__ == "__main__":
    update_college_photos()
