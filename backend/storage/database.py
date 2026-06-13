"""
SQLite connection and schema initialisation.

All table creation lives here. Nothing else imports this except:
  - storage/tracking_storage.py (get_connection)
  - main.py (init_db at startup)
"""

import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_DIR = Path(__file__).parent.parent / "data"
DB_PATH = DB_DIR / "app.db"

_CREATE_TABLES = """
CREATE TABLE IF NOT EXISTS weight_logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    weight     REAL    NOT NULL,
    note       TEXT    DEFAULT '',
    created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS water_logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    amount_ml  REAL    NOT NULL,
    note       TEXT    DEFAULT '',
    created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    calories   INTEGER,
    protein    REAL,
    carbs      REAL,
    fat        REAL,
    meal_type  TEXT    DEFAULT 'other',
    note       TEXT    DEFAULT '',
    created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT    DEFAULT 'manual',
    duration   INTEGER,
    calories   INTEGER,
    steps      INTEGER,
    distance   REAL,
    source     TEXT    DEFAULT 'manual',
    note       TEXT    DEFAULT '',
    created_at TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    weight           REAL,
    water            INTEGER,
    calories         INTEGER,
    protein          REAL,
    steps            INTEGER,
    activity_minutes INTEGER,
    mood             TEXT,
    readiness        INTEGER,
    note             TEXT    DEFAULT '',
    created_at       TEXT    NOT NULL
);
"""


@contextmanager
def get_connection():
    """Yield a sqlite3 connection; commit on exit, rollback + re-raise on error."""
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Create all tables (idempotent — safe to call on every startup)."""
    with get_connection() as conn:
        conn.executescript(_CREATE_TABLES)
