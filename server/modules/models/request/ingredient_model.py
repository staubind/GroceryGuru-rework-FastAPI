from typing import Optional
from pydantic import BaseModel

# maybe appropriate for posting a recipe, but definitely not for responding w/ spoonacular objects.
class Ingredient(BaseModel):
    spoonacular_id: int
    spoon_recipe_id: int
    quantity: int
    is_collected: bool