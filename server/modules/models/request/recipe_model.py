from typing import Optional

from pydantic import BaseModel

# maybe appropriate for posting a model, but not for GET routes.
class Recipe(BaseModel):
    recipe_id: int
    is_current: Optional[bool] = None
    # can use Field from Pydantic to do additional validation for each of these fields.
    is_favorite: Optional[bool] = None
    servings: Optional[int] = 1

    # can also add example for the docs
    # class Config:
    #     schema_extra = {
    #         "example": {
    #             "name": "Foo",
    #             "descriptoin": "A very nice Item",
    #             "price": 35.4,
    #             "tax": 3.2,
    #         }
    #     }
# and actually, when something is posted we just need to flip the current boolean value, not