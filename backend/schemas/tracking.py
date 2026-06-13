from typing import Optional
from pydantic import BaseModel


class WeightLogRequest(BaseModel):
    weight: float
    date: Optional[str] = None
    note: Optional[str] = None


class WaterLogRequest(BaseModel):
    amount: int                      # ml
    date: Optional[str] = None
    note: Optional[str] = None


class NutritionLogRequest(BaseModel):
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    meal_type: Optional[str] = None  # breakfast / lunch / dinner / snack
    note: Optional[str] = None
    date: Optional[str] = None


class ActivityLogRequest(BaseModel):
    type: Optional[str] = None       # run / walk / gym / cycling / swim …
    duration: Optional[int] = None   # minutes
    calories: Optional[int] = None
    steps: Optional[int] = None
    distance: Optional[float] = None # km
    source: Optional[str] = None     # manual / healthkit / strava / watch
    date: Optional[str] = None
    note: Optional[str] = None


class DailyLogRequest(BaseModel):
    date: Optional[str] = None
    weight: Optional[float] = None
    water: Optional[int] = None      # ml
    calories: Optional[int] = None
    protein: Optional[float] = None
    steps: Optional[int] = None
    activity_minutes: Optional[int] = None
    mood: Optional[str] = None       # great / good / ok / bad
    readiness: Optional[int] = None  # 0-100
    note: Optional[str] = None
