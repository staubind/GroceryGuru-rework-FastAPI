from typing import Optional

from pydantic import BaseModel

# maybe appropriate for posting a model, but not for GET routes.
class Recipe(BaseModel):
    spoonacular_id: int
    in_cart: bool
    in_favorites: bool

