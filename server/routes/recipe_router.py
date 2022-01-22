from typing import Optional
from fastapi import APIRouter, Depends
from dotenv import load_dotenv
import os
import sqlalchemy
from sqlalchemy.orm import Session
from typing import Optional
from aiohttp_client_cache import CachedSession, SQLiteBackend
from sqlalchemy.sql.functions import user
from modules.dependencies.request_session import get_req_session

router = APIRouter(
    prefix='/recipes',
    tags=['recipes'],
    responses={404: {"description": "Not Found"}}
)

# cache = SQLiteBackend(
#     cache_name='local_cache',
#     expire_after=3600,
#     ignored_params=['apiKey'] # uses cache response even if the token differs
# )

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
# search route.
@router.get('/search/{search}')
async def basic_get(search: str, session: CachedSession = Depends(get_req_session)):
    # make api call - couldn't we just open the session in a dependency? like with get_db? - but what about if it's asynchronous?
    # that way we don't have to write this code more than once
    # async with CachedSession(cache=cache) as session:
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
@router.post('/')
async def create_cart(recipe: Recipe, db: Session = Depends(get_db)):
    # clean the recipe dictionary - I feel like this may actually cause a KeyError...
    recipe_dict = recipe.dict()
    for key in recipe.dict().keys():
        if recipe_dict[key] == None:
            del recipe_dict[key]
    # post that dictionary to the database
    # using the ORM

    # do not use the ORM here.
    # need to change this to retrieve the user from the jwt at some point.
    # also should wrap it in a try block maybe
    # and add ability to rollback changes before we commit if there's an error.
    recipe_dict['user_id'] = 1
    query = sqlalchemy.text('INSERT INTO user_recipes (user_id, recipe_id, is_favorite, is_current, servings) VALUES (:user_id, :recipe_id, :is_favorite, :is_current, :servings)')
    result = db.execute(query, recipe_dict) 
    # also needs to post the ingredients to the db
    # no, not initially. it has to post the recipe, on first look up no ingredients will be found and we will use that fact to populate the value for the client.
    db.commit()
    # then send a success/fail response depending on the response from the db
    return recipe_dict

# to respond with a model:
#@router.post('/stuff/', response_model=ModelName)
# this limits the output to data of that model

# needs to take in a user, for now we'll assume they've got that.
@router.get('/all')
async def get_cart(
    db: Session = Depends(get_db), 
    api_session: CachedSession = Depends(get_req_session)):
    # should put all db operations in a try except block, and probably the api call, too
    # get all of the recipes from teh db that user has in the cart
    # doesn't this need to be async, otherwise it'll be blocking?
    user_id = 1
    recipe_query = sqlalchemy.text(
        '''SELECT * FROM recipes 
        JOIN ingredients
        ON recipes.id = ingredients.recipes_id
        WHERE user_id = :user_id
        ''' # have it return it where all of the ingredients are in a list or something
    ) # could probably do a join on the ingredients column here to avoid doing a db call for the ingredients.
    recipes = db.execute(recipe_query, {'user_id': user_id})
    print(recipes.all()) # returns a list of tupples containing values of the columns
    # also get whether or not they've got the ingredient in their cart
    # reach out to 3rd party api to provide the image data, etc for the cards
    #
    return {'hi':'bye'}
