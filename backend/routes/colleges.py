from fastapi import APIRouter, Query
from typing import Optional
import json
import re
from database import get_db

router = APIRouter(prefix="/api", tags=["Colleges & Scholarships"])

def normalize_text(text: str) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return re.sub(r"\s+", " ", cleaned).strip()

@router.get("/colleges")
def get_colleges(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    stream_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    # Guard against direct function invocation where Query object is default
    state = state if isinstance(state, str) else None
    district = district if isinstance(district, str) else None
    location = location if isinstance(location, str) else None
    type = type if isinstance(type, str) else None
    stream_type = stream_type if isinstance(stream_type, str) else None
    search = search if isinstance(search, str) else None

    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM colleges WHERE 1=1"
    params = []

    if state:
        query += " AND state LIKE ?"
        params.append(f"%{state}%")
    if district and district != "All Districts" and "38 Districts" not in district:
        query += " AND district LIKE ?"
        params.append(f"%{district}%")
    if location:
        query += " AND location LIKE ?"
        params.append(f"%{location}%")
    if type and type != "All":
        query += " AND type LIKE ?"
        params.append(f"%{type}%")
    if stream_type and stream_type != "All":
        query += " AND stream_type LIKE ?"
        params.append(f"%{stream_type}%")

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    normalized_search = normalize_text(search) if search else ""

    for r in rows:
        c = dict(r)
        try:
            c["courses_offered"] = json.loads(c["courses_offered"])
        except Exception:
            c["courses_offered"] = []
            
        try:
            c["cutoff_marks"] = json.loads(c["cutoff_marks"])
        except Exception:
            c["cutoff_marks"] = {}

        if normalized_search:
            norm_name = normalize_text(c["name"])
            norm_loc = normalize_text(c["location"])
            norm_dist = normalize_text(c["district"])
            norm_stream = normalize_text(c["stream_type"])
            courses_str = " ".join([normalize_text(crs) for crs in c["courses_offered"]])
            
            # Check search tokens against college name, courses, stream, location, district
            tokens = [t for t in normalized_search.split(" ") if len(t) > 1]
            matches = any(
                t in norm_name or t in norm_loc or t in norm_dist or t in norm_stream or t in courses_str
                for t in tokens
            ) if tokens else (normalized_search in norm_name)
            
            if matches:
                results.append(c)
        else:
            results.append(c)

    return {"colleges": results}

@router.get("/scholarships")
def get_scholarships():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scholarships")
    rows = cursor.fetchall()
    conn.close()
    
    return {"scholarships": [dict(r) for r in rows]}
