memory: dict = {
    # --- app state ---
    "language": "tr",
    "plan": "Free",
    "profile": {},
    "dashboard": {},
    "has_plan": False,
    # --- dashboard counters (read by existing dashboard endpoint) ---
    "water_ml": 0,
    "water_logs": [],          # shared: written by /water/add and /tracking/water
    "step_goal": 8000,
    "daily_steps": 0,
    "calories_consumed": 0,
    "protein_consumed": 0,
    "progress_logs": [],
    "chat": [],
    "photo_count": 0,
    "video_count": 0,
    "photo_analysis": [],
    "video_analysis": [],
}
