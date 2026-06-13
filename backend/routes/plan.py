import logging

from fastapi import APIRouter

from schemas.plan import Profile
from services.plan_service import create_plan as svc_create_plan

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/create-plan")
def create_plan(profile: Profile):
    logger.info("POST /create-plan")
    try:
        return svc_create_plan(profile)
    except Exception as e:
        logger.error(f"Error creating plan: {e}", exc_info=True)
        raise
