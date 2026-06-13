from fastapi import APIRouter

from schemas.water import WaterAdd
from services.water_service import add_water as svc_add_water

router = APIRouter()


@router.post("/water/add")
def add_water(data: WaterAdd):
    return svc_add_water(data.amount_ml)
