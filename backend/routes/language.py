from fastapi import APIRouter

from schemas.language import LanguageUpdate
from services.memory import memory
from utils.config import ALLOWED_LANGUAGES

router = APIRouter()


@router.post("/language")
def update_language(data: LanguageUpdate):
    memory["language"] = data.language if data.language in ALLOWED_LANGUAGES else "tr"
    return {"language": memory["language"]}
