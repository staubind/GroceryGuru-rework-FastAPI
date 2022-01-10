from typing import Optional
from fastapi import APIRouter, Depends
from dotenv import load_dotenv
import os
import sqlalchemy
from sqlalchemy.orm import Session
from typing import Optional
from aiohttp_client_cache import CachedSession, SQLiteBackend

router = APIRouter(
    prefix='/recipes',
    tags=['recipes'],
    responses={404: {"description": "Not Found"}}
)

cache = SQLiteBackend(
    cache_name='local_cache',
    expire_after=3600,
    ignored_params=['apiKey'] # uses cache response even if the token differs
)

load_dotenv(os.path.dirname(os.getcwd())+'/.env')

SPOONACULAR_API_KEY = os.environ.get('SPOONACULAR_API_KEY')


# @router.get('/')
# # this whole thing returns a coroutine. how do I have it actually run it..?
# async def basic_get():
#     # make api call
#     async with httpx.AsyncClient() as client:
#         print(SPOONACULAR_API_KEY)
#         r = await client.get(
#             'https://api.spoonacular.com/recipes/complexSearch', 
#             params={
#                 "apiKey": SPOONACULAR_API_KEY,
#                 "query": "tacos"
#             }
#         )
#     # data = asyncio.run(r)
#     # return info
#     return {'data': r.json()} # json to serialize it upon return

async def get_api(session, url, params):
    #async with session.get(url + f'?apiKey={SPOONACULAR_API_KEY}&query=tacos') as response:
    #    return await response.text()
    async with session.get(url, params=params) as response:
        return await response.json() # returns dictionary of the results.

# aihttp-version
@router.get('/{search}')
async def basic_get(search: str):
    # make api call - couldn't we just open the session in a dependency? like with get_db?
    # that way we don't have to write this code more than once
    async with CachedSession(cache=cache) as session:
        #async with aiohttp.ClientSession() as session:
        response = await get_api(
            session, 
            'https://api.spoonacular.com/recipes/complexSearch', 
            {"apiKey": SPOONACULAR_API_KEY, "query": search})
        # print(response.get('results')[0])
    return {'data': response} # json to serialize it upon return


# from modules.options.path_param_options import ModelName
# @router.get('/options/{some_options}')
# async def hello_world(some_options: ModelName):
#     return {'data':some_options}

# @router.get('/queries/')
# async def hello_world(q: Optional[str] = None, model: Optional[ModelName] = None):
#     return {
#         'model':model,
#         'boolean': q
#     }

from modules.models.request.recipe_model import Recipe
from modules.dependencies.db_session import get_db
# still need to figure out how to collect the user id for posting.ß
# and need to connect to db and post it.
@router.post('/recipes/')
async def create_cart(recipe: Recipe, db: Session = Depends(get_db)):
    # clean the recipe dictionary - I feel like this may actually cause a KeyError...
    recipe_dict = recipe.dict()
    for key in recipe.dict().keys():
        if recipe_dict[key] == None:
            del recipe_dict[key]
    # post that dictionary to the database
    # using the ORM

    # do not use the ORM here.
    recipe_dict['user_id'] = 1
    query = sqlalchemy.text('INSERT INTO user_recipes (user_id, recipe_id, is_favorite, is_current, servings) VALUES (:user_id, :recipe_id, :is_favorite, :is_current, :servings)')
    result = db.execute(query, recipe_dict) 
    db.commit()
    # this seems to work - or it doesn't throw errors, but it doesn't actually affect the db
    # setting autocommit to True in pool.py lets it work!

    # then send a success/fail response depending on the response from the db
    return recipe_dict

# to respond with a model:
#@router.post('/stuff/', response_model=ModelName)
# this limits the output to data of that model

# purely for testing
# from modules.pool import SessionLocal
# from modules.schemas.user_schemas import create_user, User, get_user
# #### END TESTING

# with SessionLocal() as db:
#     try:
#         create_user(db, User(username='marko20220', password='123abc'))
#         new_user = get_user(db, 7)
#         print(new_user)
#     finally:
#         db.close()