
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import logging
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from utils.config import CORS_ORIGINS
from services.memory import memory
from storage.database import init_db, get_connection
from routes.plan import router as plan_router
from routes.dashboard import router as dashboard_router
from routes.water import router as water_router
from routes.coach import router as coach_router
from routes.analysis import router as analysis_router
from routes.language import router as language_router
from routes.tracking import router as tracking_router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(name)s] - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan_router)
app.include_router(dashboard_router)
app.include_router(water_router)
app.include_router(coach_router)
app.include_router(analysis_router)
app.include_router(language_router)
app.include_router(tracking_router)

# ── Database init ─────────────────────────────────────────────────────────────

def _restore_water_ml() -> int:
    """Sum today's water_logs from SQLite to seed the in-memory dashboard counter."""
    today = datetime.now().date().isoformat()
    try:
        with get_connection() as conn:
            row = conn.execute(
                "SELECT COALESCE(SUM(amount_ml), 0) FROM water_logs WHERE created_at >= ?",
                (today,),
            ).fetchone()
            return int(row[0]) if row else 0
    except Exception as exc:
        logger.warning(f"Could not restore water_ml from DB: {exc}")
        return 0


init_db()
logger.info("SQLite database initialised")

memory["water_ml"] = _restore_water_ml()
logger.info(f"Restored water_ml={memory['water_ml']} ml from today's DB entries")


@app.get("/")
def home():
    logger.info("GET /")
    return {
        "message": "AI Fitness Coach Backend Running",
        "status": "ok",
        "language": memory["language"],
        "has_plan": memory["has_plan"],
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend is awake",
        "time": datetime.now().isoformat(),
    }
