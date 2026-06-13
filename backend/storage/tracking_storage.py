"""
Tracking log CRUD operations — SQLite backend.

All five log types route through here. Routes and services stay unchanged.
To migrate to Postgres: swap only get_connection() import and SQL dialect.
"""

from datetime import datetime, timezone

from services.memory import memory
from storage.database import get_connection


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── Weight ────────────────────────────────────────────────────────────────────

def add_weight_log(entry: dict) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO weight_logs (weight, note, created_at) VALUES (?, ?, ?)",
            (
                entry.get("weight"),
                entry.get("note", ""),
                entry.get("date") or _now_iso(),
            ),
        )


def get_weight_logs() -> list:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT weight, note, created_at AS date FROM weight_logs ORDER BY id"
        ).fetchall()
    return [dict(r) for r in rows]


# ── Water ─────────────────────────────────────────────────────────────────────
# Both /water/add (water_service) and /tracking/water POST (tracking_service)
# call add_water_log(). It writes to SQLite and keeps memory["water_ml"] in sync
# so the dashboard counter never goes stale.

def add_water_log(entry: dict) -> None:
    amount_ml = entry.get("amount_ml", 0)
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO water_logs (amount_ml, note, created_at) VALUES (?, ?, ?)",
            (
                amount_ml,
                entry.get("note", ""),
                entry.get("date") or entry.get("time") or _now_iso(),
            ),
        )
    # Keep in-memory counter in sync for GET /dashboard and get_water_total_ml()
    memory["water_ml"] = memory.get("water_ml", 0) + amount_ml


def get_water_logs() -> list:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, amount_ml, note, created_at FROM water_logs ORDER BY id"
        ).fetchall()

    result = []
    running = 0
    for row in rows:
        running += row["amount_ml"]
        result.append({
            "amount_ml": int(row["amount_ml"]),
            "total_ml": int(running),
            "time": row["created_at"],
            "note": row["note"],
        })
    return result


def get_water_total_ml() -> int:
    # memory["water_ml"] is always in sync: seeded on startup, incremented on each add
    return int(memory.get("water_ml", 0))


# ── Nutrition ─────────────────────────────────────────────────────────────────

def add_nutrition_log(entry: dict) -> None:
    with get_connection() as conn:
        conn.execute(
            """INSERT INTO nutrition_logs
               (calories, protein, carbs, fat, meal_type, note, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                entry.get("calories"),
                entry.get("protein"),
                entry.get("carbs"),
                entry.get("fat"),
                entry.get("meal_type", "other"),
                entry.get("note", ""),
                entry.get("date") or _now_iso(),
            ),
        )


def get_nutrition_logs() -> list:
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT calories, protein, carbs, fat, meal_type, note,
                      created_at AS date
               FROM nutrition_logs ORDER BY id"""
        ).fetchall()
    return [dict(r) for r in rows]


# ── Activity ──────────────────────────────────────────────────────────────────

def add_activity_log(entry: dict) -> None:
    with get_connection() as conn:
        conn.execute(
            """INSERT INTO activity_logs
               (type, duration, calories, steps, distance, source, note, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                entry.get("type", "manual"),
                entry.get("duration"),
                entry.get("calories"),
                entry.get("steps"),
                entry.get("distance"),
                entry.get("source", "manual"),
                entry.get("note", ""),
                entry.get("date") or _now_iso(),
            ),
        )


def get_activity_logs() -> list:
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT type, duration, calories, steps, distance, source, note,
                      created_at AS date
               FROM activity_logs ORDER BY id"""
        ).fetchall()
    return [dict(r) for r in rows]


# ── Daily ─────────────────────────────────────────────────────────────────────

def add_daily_log(entry: dict) -> None:
    with get_connection() as conn:
        conn.execute(
            """INSERT INTO daily_logs
               (weight, water, calories, protein, steps, activity_minutes,
                mood, readiness, note, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                entry.get("weight"),
                entry.get("water"),
                entry.get("calories"),
                entry.get("protein"),
                entry.get("steps"),
                entry.get("activity_minutes"),
                entry.get("mood"),
                entry.get("readiness"),
                entry.get("note", ""),
                entry.get("date") or _now_iso(),
            ),
        )


def get_daily_logs() -> list:
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT weight, water, calories, protein, steps, activity_minutes,
                      mood, readiness, note, created_at AS date
               FROM daily_logs ORDER BY id"""
        ).fetchall()
    return [dict(r) for r in rows]


# ── Summary ───────────────────────────────────────────────────────────────────

def get_tracking_summary() -> dict:
    weight_logs = get_weight_logs()
    water_logs = get_water_logs()
    nutrition_logs = get_nutrition_logs()
    activity_logs = get_activity_logs()
    daily_logs = get_daily_logs()

    latest_weight = weight_logs[-1].get("weight") if weight_logs else None
    total_water_ml = get_water_total_ml()

    total_calories = sum(n.get("calories", 0) or 0 for n in nutrition_logs)
    total_protein = sum(n.get("protein", 0) or 0 for n in nutrition_logs)
    total_steps = sum(a.get("steps", 0) or 0 for a in activity_logs)
    total_activity_minutes = sum(a.get("duration", 0) or 0 for a in activity_logs)

    return {
        "weight": {
            "log_count": len(weight_logs),
            "latest_weight": latest_weight,
        },
        "water": {
            "log_count": len(water_logs),
            "total_ml": total_water_ml,
        },
        "nutrition": {
            "log_count": len(nutrition_logs),
            "total_calories": total_calories,
            "total_protein": total_protein,
        },
        "activity": {
            "log_count": len(activity_logs),
            "total_steps": total_steps,
            "total_minutes": total_activity_minutes,
        },
        "daily": {
            "log_count": len(daily_logs),
        },
    }
