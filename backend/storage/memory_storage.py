"""
Low-level accessor for the shared in-memory store.

This is the only place that directly touches the memory dict.
Swap this file (and tracking_storage.py) to migrate to SQLite/Postgres
without touching services or routes.
"""

from services.memory import memory


def get_memory() -> dict:
    return memory


def mem_get(key: str, default=None):
    return memory.get(key, default)


def mem_set(key: str, value) -> None:
    memory[key] = value


def mem_append(key: str, item: dict) -> None:
    memory.setdefault(key, []).append(item)


def mem_increment(key: str, amount: float) -> None:
    memory[key] = memory.get(key, 0) + amount
