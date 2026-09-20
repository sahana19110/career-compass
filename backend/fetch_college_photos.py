import sqlite3
import os
import requests
import urllib.parse
from database import get_db, DB_PATH

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "")

def fetch_wikipedia_photo(college_name):
    try:
        # Step 1: Search Wikipedia for the best matching page title
        clean_query = college_name.split("(")[0].strip()
        search_api = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(clean_query)}&format=json"
        s_res = requests.get(search_api, timeout=5, headers={"User-Agent": "AscentiaAI/1.0"}).json()
        search_results = s_res.get("query", {}).get("search", [])
        if not search_results:
            return None, None

        page_title = search_results[0]["title"]
        # Step 2: Get thumbnail image for page_title
        image_api = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(page_title)}&prop=pageimages&format=json&pithumbsize=600"
        i_res = requests.get(image_api, timeout=5, headers={"User-Agent": "AscentiaAI/1.0"}).json()
        pages = i_res.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if "thumbnail" in page_data:
                return page_data["thumbnail"]["source"], f"Photo via Wikipedia ({page_title})"
    except Exception as e:
        pass
    return None, None

def fetch_google_places_photo(college_name, location):
    if not GOOGLE_PLACES_API_KEY:
        return None, None
    try:
        query = f"{college_name}, {location}"
        search_url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={urllib.parse.quote(query)}&inputtype=textquery&fields=photos,formatted_address,name&key={GOOGLE_PLACES_API_KEY}"
        res = requests.get(search_url, timeout=5).json()
        candidates = res.get("candidates", [])
        if candidates and "photos" in candidates[0]:
            photo_ref = candidates[0]["photos"][0]["photo_reference"]
            html_attributions = candidates[0]["photos"][0].get("html_attributions", [])
            attr_text = html_attributions[0] if html_attributions else "Photo via Google Places"
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference={photo_ref}&key={GOOGLE_PLACES_API_KEY}"
            return photo_url, attr_text
    except Exception as e:
        print(f"Google Places fetch error for {college_name}: {e}")
    return None, None

def update_college_photos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, location FROM colleges")
    colleges = cursor.fetchall()

    print(f"Processing photo links for {len(colleges)} colleges...")
    updated_count = 0

    for col in colleges:
        col_id, col_name, location = col["id"], col["name"], col["location"]
        
        # 1. Try Google Places API if key exists
        img_url, attr = fetch_google_places_photo(col_name, location)
        
        # 2. Try Wikipedia / Wikimedia Commons API
        if not img_url:
            img_url, attr = fetch_wikipedia_photo(col_name)

        if img_url:
            cursor.execute("UPDATE colleges SET image_url = ?, photo_attribution = ? WHERE id = ?", (img_url, attr, col_id))
            updated_count += 1
            print(f"[OK] Found photo for {col_name}")
        else:
            print(f"[FALLBACK] Initial badge fallback for {col_name}")

    conn.commit()
    conn.close()
    print(f"Photo update complete. {updated_count}/{len(colleges)} college photos updated in database.")

if __name__ == "__main__":
    update_college_photos()
