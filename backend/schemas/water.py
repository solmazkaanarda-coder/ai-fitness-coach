from pydantic import BaseModel


class WaterAdd(BaseModel):
    amount_ml: int
