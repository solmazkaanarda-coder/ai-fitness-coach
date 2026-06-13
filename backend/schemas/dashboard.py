from pydantic import BaseModel


class StepGoalUpdate(BaseModel):
    step_goal: int


class ProgressLog(BaseModel):
    day_label: str
    weight: float
    body_fat: float
    steps: int = 0
    water_ml: int = 0
    note: str = ""


class DailyIntake(BaseModel):
    calories_consumed: int = 0
    protein_consumed: int = 0
