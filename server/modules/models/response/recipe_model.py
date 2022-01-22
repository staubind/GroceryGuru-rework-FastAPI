# to be used in a list of recipe objects that are returned.
# additionally, we only need to include the recipe, the ingredients, the instructions and description.
# as I recall, meaning the recipe objects returned from Spoonacular will greatly trimmed
from typing import List, Optional
from ingredient_model import Ingredient
from pydantic.main import BaseModel

# may need to change typing later
class Recipe(BaseModel):
    spoonacular_recipe_id: int
    title: str
    description: str
    instructions: str
    ingredients: List[Ingredient] = []

    #things we acces:
    # readyInMinutes
    # servings
    # title
    # summary
    # in cart vs not
    # analyzedInstructions
    # extendedIngredients
    # servingsRequested(so we can use it to add carrots to carrots etc)