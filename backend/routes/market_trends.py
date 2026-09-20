from fastapi import APIRouter
import json
from database import get_db

router = APIRouter(prefix="/api/market-trends", tags=["Labor Market Trends"])

@router.get("")
def get_market_trends():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM labor_market_trends ORDER BY demand_score DESC")
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        item = dict(r)
        item["top_skills"] = json.loads(item["top_skills"])
        item["hiring_companies"] = json.loads(item["hiring_companies"])
        results.append(item)

    return {"market_trends": results}
