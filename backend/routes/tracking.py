from fastapi import APIRouter

from schemas.tracking import (
    WeightLogRequest,
    WaterLogRequest,
    NutritionLogRequest,
    ActivityLogRequest,
    DailyLogRequest,
)
from services.tracking_service import (
    fetch_tracking_summary,
    log_weight,
    fetch_weight_logs,
    log_water,
    fetch_water_logs,
    log_nutrition,
    fetch_nutrition_logs,
    log_activity,
    fetch_activity_logs,
    log_daily,
    fetch_daily_logs,
)

router = APIRouter(prefix="/tracking", tags=["tracking"])


@router.get("/summary")
def tracking_summary():
    return fetch_tracking_summary()


@router.post("/weight")
def add_weight(data: WeightLogRequest):
    return log_weight(data)


@router.get("/weight")
def get_weight():
    return fetch_weight_logs()


@router.post("/water")
def add_water(data: WaterLogRequest):
    return log_water(data)


@router.get("/water")
def get_water():
    return fetch_water_logs()


@router.post("/nutrition")
def add_nutrition(data: NutritionLogRequest):
    return log_nutrition(data)


@router.get("/nutrition")
def get_nutrition():
    return fetch_nutrition_logs()


@router.post("/activity")
def add_activity(data: ActivityLogRequest):
    return log_activity(data)


@router.get("/activity")
def get_activity():
    return fetch_activity_logs()


@router.post("/daily")
def add_daily(data: DailyLogRequest):
    return log_daily(data)


@router.get("/daily")
def get_daily():
    return fetch_daily_logs()
