from fastapi import APIRouter

from schemas.analysis import AnalysisRequest
from services.analysis_service import analyze as svc_analyze

router = APIRouter()


@router.post("/analyze")
def analyze(data: AnalysisRequest):
    return svc_analyze(data.media_type, data.plan, data.language)
