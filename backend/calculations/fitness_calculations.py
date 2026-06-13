def calculate_bmr(weight: float, height: float, age: int, gender: str) -> int:
    gender_key = gender.strip().lower()
    base = 10 * weight + 6.25 * height - 5 * age
    return round(base + (5 if gender_key == "male" else -161))


def calculate_tdee(bmr: int, activity_level: str) -> int:
    activity_key = activity_level.strip().lower()
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "low": 1.3,
        "moderate": 1.55,
        "high": 1.75,
        "active": 1.725,
        "athlete": 1.9,
    }
    multiplier = multipliers.get(activity_key, 1.55)
    return round(bmr * multiplier)


def calculate_calorie_target(tdee: int, goal: str) -> int:
    goal_key = goal.strip().lower()

    if "fat" in goal_key or "loss" in goal_key:
        target = round(tdee * 0.85)
        return max(1200, target)

    if "muscle" in goal_key or "gain" in goal_key:
        return round(tdee * 1.1)

    return round(tdee)


def calculate_protein_target(weight: float, goal: str) -> int:
    goal_key = goal.strip().lower()

    if "fat" in goal_key or "loss" in goal_key:
        return round(weight * 2.0)

    if "muscle" in goal_key or "gain" in goal_key:
        return round(weight * 2.2)

    return round(weight * 1.6)


def calculate_water_target(weight: float) -> tuple[int, float]:
    ml = round(weight * 35)
    liters = round(ml / 1000, 2)
    return ml, liters


def calculate_target_weight(weight: float, goal: str) -> float:
    goal_key = goal.strip().lower()
    if "fat" in goal_key or "loss" in goal_key:
        return round(weight * 0.92, 1)
    if "muscle" in goal_key or "gain" in goal_key:
        return round(weight * 1.05, 1)
    return round(weight, 1)


def calculate_step_goal(activity_level: str, goal: str, requested_step_goal: int) -> int:
    activity_key = activity_level.strip().lower()
    baseline = {
        "sedentary": 5000,
        "light": 7000,
        "low": 7000,
        "moderate": 9000,
        "high": 11000,
        "active": 11000,
        "athlete": 13000,
    }.get(activity_key, 9000)

    goal_key = goal.strip().lower()
    adjustment = 0

    if "fat" in goal_key or "loss" in goal_key:
        adjustment = 1000
    elif "muscle" in goal_key or "gain" in goal_key:
        adjustment = 500

    calculated = baseline + adjustment
    return max(4000, max(calculated, requested_step_goal))
