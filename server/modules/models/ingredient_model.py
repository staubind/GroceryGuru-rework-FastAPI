from typing import Optional
from pydantic import BaseModel

class Ingredient(BaseModel):
    spoonacular_id: int
    spoon_recipe_id: int
    quantity: int
    is_collected: bool