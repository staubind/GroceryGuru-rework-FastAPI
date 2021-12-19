from typing import Optional

from pydantic import BaseModel

class Recipe(BaseModel):
    spoonacular_id: int
    in_cart: bool
    in_favorites: bool

