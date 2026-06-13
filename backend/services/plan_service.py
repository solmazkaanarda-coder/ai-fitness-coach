import logging
from datetime import datetime

from calculations.fitness_calculations import (
    calculate_bmr,
    calculate_tdee,
    calculate_calorie_target,
    calculate_protein_target,
    calculate_water_target,
    calculate_step_goal,
)
from schemas.plan import Profile
from utils.config import PREMIUM_PRICE
from services.memory import memory

logger = logging.getLogger(__name__)


def create_plan(profile: Profile) -> dict:
    logger.info(
        f"Plan creation: name={profile.name}, age={profile.age}, "
        f"gender={profile.gender}, goal={profile.goal}, plan={profile.plan}"
    )

    bmr = calculate_bmr(profile.weight, profile.height, profile.age, profile.gender)
    tdee = calculate_tdee(bmr, profile.activity_level)
    calorie_target = calculate_calorie_target(tdee, profile.goal)
    protein_target = calculate_protein_target(profile.weight, profile.goal)
    water_target_ml, water_liters = calculate_water_target(profile.weight)
    daily_step_goal = calculate_step_goal(profile.activity_level, profile.goal, profile.step_goal)

    logger.info(
        f"BMR={bmr}, TDEE={tdee}, calories={calorie_target}, "
        f"protein={protein_target}g, water={water_liters}L, steps={daily_step_goal}"
    )

    memory["profile"] = profile.dict()
    memory["plan"] = profile.plan
    memory["has_plan"] = True
    memory["step_goal"] = daily_step_goal
    memory["daily_steps"] = 0
    memory["water_ml"] = 0
    memory["water_logs"] = []
    memory["calories_consumed"] = 0
    memory["protein_consumed"] = 0
    memory["progress_logs"] = []

    dashboard = {
        "name": profile.name,
        "goal": profile.goal,
        "plan": profile.plan,
        "weight": profile.weight,
        "starting_weight": profile.weight,
        "target_weight": profile.target_weight,
        "bmr": bmr,
        "tdee": tdee,
        "calorie_target": calorie_target,
        "calories": calorie_target,
        "maintenance_calories": tdee,
        "protein_target": protein_target,
        "protein": protein_target,
        "water_liters": water_liters,
        "water_target_ml": water_target_ml,
        "step_goal": daily_step_goal,
        "daily_step_goal": daily_step_goal,
        "daily_steps": 0,
        "progress_count": 0,
        "premium_price": PREMIUM_PRICE,
        "created_at": datetime.now().isoformat(),
    }

    memory["dashboard"] = dashboard
    logger.info("Plan created successfully")
    return dashboard
