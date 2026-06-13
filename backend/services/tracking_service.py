"""
Tracking service — validates, normalizes, and delegates to tracking_storage.

No FastAPI imports here. No route logic here.
"""

from datetime import datetime, timezone

from schemas.tracking import (
    WeightLogRequest,
    WaterLogRequest,
    NutritionLogRequest,
    ActivityLogRequest,
    DailyLogRequest,
)
from storage.tracking_storage import (
    add_weight_log,
    get_weight_logs,
    add_water_log,
    get_water_logs,
    get_water_total_ml,
    add_nutrition_log,
    get_nutrition_logs,
    add_activity_log,
    get_activity_logs,
    add_daily_log,
    get_daily_logs,
    get_tracking_summary,
)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _resolve_date(date: str | None) -> str:
    return date if date else _now_iso()


# ── Weight ────────────────────────────────────────────────────────────────────

def log_weight(req: WeightLogRequest) -> dict:
    entry = {
        "weight": req.weight,
        "date": _resolve_date(req.date),
        "note": req.note or "",
    }
    add_weight_log(entry)
    logs = get_weight_logs()
    return {
        "success": True,
        "data": entry,
        "log_count": len(logs),
    }


def fetch_weight_logs() -> dict:
    logs = get_weight_logs()
    return {
        "success": True,
        "data": logs,
        "log_count": len(logs),
    }


# ── Water ─────────────────────────────────────────────────────────────────────

def log_water(req: WaterLogRequest) -> dict:
    entry = {
        "amount_ml": req.amount,
        "total_ml": get_water_total_ml() + req.amount,
        "date": _resolve_date(req.date),
        "note": req.note or "",
    }
    add_water_log(entry)
    return {
        "success": True,
        "data": entry,
        "water_ml": get_water_total_ml(),
        "log_count": len(get_water_logs()),
    }


def fetch_water_logs() -> dict:
    logs = get_water_logs()
    return {
        "success": True,
        "data": logs,
        "water_ml": get_water_total_ml(),
        "log_count": len(logs),
    }


# ── Nutrition ─────────────────────────────────────────────────────────────────

def log_nutrition(req: NutritionLogRequest) -> dict:
    entry = {
        "calories": req.calories,
        "protein": req.protein,
        "carbs": req.carbs,
        "fat": req.fat,
        "meal_type": req.meal_type or "other",
        "note": req.note or "",
        "date": _resolve_date(req.date),
    }
    add_nutrition_log(entry)
    logs = get_nutrition_logs()
    return {
        "success": True,
        "data": entry,
        "log_count": len(logs),
    }


def fetch_nutrition_logs() -> dict:
    logs = get_nutrition_logs()
    return {
        "success": True,
        "data": logs,
        "log_count": len(logs),
    }


# ── Activity ──────────────────────────────────────────────────────────────────

def log_activity(req: ActivityLogRequest) -> dict:
    entry = {
        "type": req.type or "manual",
        "duration": req.duration,
        "calories": req.calories,
        "steps": req.steps,
        "distance": req.distance,
        "source": req.source or "manual",
        "date": _resolve_date(req.date),
        "note": req.note or "",
    }
    add_activity_log(entry)
    logs = get_activity_logs()
    return {
        "success": True,
        "data": entry,
        "log_count": len(logs),
    }


def fetch_activity_logs() -> dict:
    logs = get_activity_logs()
    return {
        "success": True,
        "data": logs,
        "log_count": len(logs),
    }


# ── Daily ─────────────────────────────────────────────────────────────────────

def log_daily(req: DailyLogRequest) -> dict:
    entry = {
        "date": _resolve_date(req.date),
        "weight": req.weight,
        "water": req.water,
        "calories": req.calories,
        "protein": req.protein,
        "steps": req.steps,
        "activity_minutes": req.activity_minutes,
        "mood": req.mood,
        "readiness": req.readiness,
        "note": req.note or "",
    }
    add_daily_log(entry)
    logs = get_daily_logs()
    return {
        "success": True,
        "data": entry,
        "log_count": len(logs),
    }


def fetch_daily_logs() -> dict:
    logs = get_daily_logs()
    return {
        "success": True,
        "data": logs,
        "log_count": len(logs),
    }


# ── Summary ───────────────────────────────────────────────────────────────────

def fetch_tracking_summary() -> dict:
    return {
        "success": True,
        "data": get_tracking_summary(),
    }
