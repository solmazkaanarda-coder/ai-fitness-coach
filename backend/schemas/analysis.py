from pydantic import BaseModel


class AnalysisRequest(BaseModel):
    media_type: str
    plan: str
    language: str = "tr"
    note: str = ""
