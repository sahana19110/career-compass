from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ai_engine import recommend_pathway

router = APIRouter(prefix="/api/recommend", tags=["Recommendations"])

class LearnerProfileRequest(BaseModel):
    education: str # e.g. '10th', '12th_PCM', '12th_PCB', '12th_Commerce', 'Diploma', 'UG'
    prior_skills: List[str]
    target_career: str
    location: Optional[str] = "Chennai"
    pace: Optional[str] = "Standard"

@router.post("")
def get_career_recommendation(profile: LearnerProfileRequest):
    try:
        data = profile.dict()
        result = recommend_pathway(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
