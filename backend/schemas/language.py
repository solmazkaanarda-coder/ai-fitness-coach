from pydantic import BaseModel


class LanguageUpdate(BaseModel):
    language: str
