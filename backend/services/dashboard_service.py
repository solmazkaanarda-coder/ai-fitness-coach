import logging

from calculations.readiness import calculate_readiness_score
from services.memory import memory

logger = logging.getLogger(__name__)


def get_dashboard() -> dict:
    logger.info(
        f"Dashboard fetch: has_plan={memory['has_plan']}, "
        f"name={memory['profile'].get('name', 'N/A') if memory['profile'] else 'None'}"
    )

    water_target_ml = (
        memory["dashboard"].get("water_target_ml", 2800) if memory["dashboard"] else 2800
    )
    readiness = calculate_readiness_score(
        memory["water_ml"],
        water_target_ml,
        memory["daily_steps"],
        memory["step_goal"],
        len(memory["progress_logs"]),
    )

    response = {
        "has_plan": memory["has_plan"],
        "profile": memory["profile"],
        "dashboard": memory["dashboard"],
        "water_ml": memory["water_ml"],
        "water_logs": memory["water_logs"],
        "step_goal": memory["step_goal"],
        "daily_steps": memory["daily_steps"],
        "calories_consumed": memory["calories_consumed"],
        "protein_consumed": memory["protein_consumed"],
        "readiness_score": readiness,
        "readiness_status": "no_data" if readiness is None else "active",
        "progress_logs": memory["progress_logs"],
        "progress_count": len(memory["progress_logs"]),
        "photo_count": memory["photo_count"],
        "video_count": memory["video_count"],
        "language": memory["language"],
    }

    logger.info(f"Dashboard response keys: {list(response.keys())}")
    return response


def update_step_goal(step_goal: int) -> dict:
    memory["step_goal"] = step_goal
    if memory["dashboard"]:
        memory["dashboard"]["step_goal"] = step_goal
        memory["dashboard"]["daily_step_goal"] = step_goal
    return {"step_goal": memory["step_goal"], "message": "Step goal updated"}


def add_progress(log: dict) -> dict:
    memory["progress_logs"].append(log)
    memory["daily_steps"] = log["steps"]
    if memory["dashboard"]:
        memory["dashboard"]["daily_steps"] = log["steps"]
        memory["dashboard"]["progress_count"] = len(memory["progress_logs"])
    return {
        "message": "Progress saved",
        "progress_logs": memory["progress_logs"],
        "progress_count": len(memory["progress_logs"]),
        "daily_steps": memory["daily_steps"],
    }


def get_progress() -> dict:
    return {
        "progress_logs": memory["progress_logs"],
        "progress_count": len(memory["progress_logs"]),
    }


def log_daily_intake(calories_consumed: int, protein_consumed: int) -> dict:
    memory["calories_consumed"] = calories_consumed
    memory["protein_consumed"] = protein_consumed
    return {
        "calories_consumed": memory["calories_consumed"],
        "protein_consumed": memory["protein_consumed"],
    }
