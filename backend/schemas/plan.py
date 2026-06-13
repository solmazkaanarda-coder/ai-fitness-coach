from typing import Optional

from pydantic import BaseModel


class Profile(BaseModel):
    name: str
    email: str = ""
    phone: str = ""
    age: int
    gender: str
    height: float
    weight: float
    target_weight: Optional[float] = None
    goal: str
    activity_level: str = "moderate"
    plan: str
    step_goal: int = 8000
