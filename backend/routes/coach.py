from fastapi import APIRouter

from schemas.coach import ChatMessage
from services.coach_service import chat as svc_chat

router = APIRouter()


@router.post("/chat")
def chat(data: ChatMessage):
    return svc_chat(data.message, data.language)
