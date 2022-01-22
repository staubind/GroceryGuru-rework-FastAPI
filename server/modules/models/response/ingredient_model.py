# to be used inside of the recipe_model that we actually pass back to the frontt end


from typing import List, Optional

from pydantic.main import BaseModel

# may need to change typing later
class Ingredient(BaseModel):
    name: str