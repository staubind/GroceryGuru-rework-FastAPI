from typing import Optional

from pydantic import BaseModel

# maybe appropriate for posting a model, but not for GET routes.
class Recipe(BaseModel):
    spoonacular_id: int
    in_cart: Optional[bool] = None
    in_favorites: Optional[bool] = None

# and actually, when something is posted we just need to flip the current boolean value, not