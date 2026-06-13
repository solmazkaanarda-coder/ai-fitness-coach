import logging
from datetime import datetime

from fastapi import APIRouter

from schemas.dashboard import StepGoalUpdate, ProgressLog, DailyIntake
from services.dashboard_service import (
    get_dashboard as svc_get_dashboard,
    update_step_goal as svc_update_step_goal,
    add_progress as svc_add_progress,
    get_progress as svc_get_progress,
    log_daily_intake as svc_log_daily_intake,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/dashboard")
def dashboard():
    logger.info("GET /dashboard")
    return svc_get_dashboard()


@router.post("/steps/goal")
def update_step_goal(data: StepGoalUpdate):
    return svc_update_step_goal(data.step_goal)


@router.post("/progress/add")
def add_progress(data: ProgressLog):
    log = data.dict()
    log["created_at"] = datetime.now().isoformat()
    return svc_add_progress(log)


@router.get("/progress")
def get_progress():
    return svc_get_progress()


@router.post("/daily/intake")
def log_daily_intake(data: DailyIntake):
    return svc_log_daily_intake(data.calories_consumed, data.protein_consumed)
