def calculate_readiness_score(
    water_ml: int,
    water_target_ml: int,
    daily_steps: int,
    step_goal: int,
    progress_count: int,
):
    if water_ml == 0 and daily_steps == 0 and progress_count == 0:
        return None
    water_pct = min(1.0, water_ml / max(1, water_target_ml))
    steps_pct = min(1.0, daily_steps / max(1, step_goal))
    logged_bonus = 1.0 if progress_count > 0 else 0.0
    score = round((water_pct * 40) + (steps_pct * 40) + (logged_bonus * 20))
    return max(0, min(100, score))
