from datetime import datetime

from services.memory import memory
from storage.tracking_storage import add_water_log


def add_water(amount_ml: int) -> dict:
    entry = {
        "amount_ml": amount_ml,
        "time": datetime.now().isoformat(),
    }
    # Persists to SQLite and updates memory["water_ml"]
    add_water_log(entry)
    total = memory["water_ml"]

    # Keep legacy memory["water_logs"] list for GET /dashboard response
    memory["water_logs"].append({
        "amount_ml": amount_ml,
        "total_ml": total,
        "time": entry["time"],
    })

    return {
        "water_ml": total,
        "added": amount_ml,
        "message": f"{amount_ml} ml added",
    }
