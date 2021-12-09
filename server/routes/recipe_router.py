from fastapi import APIRouter
from dotenv import load_dotenv
import os
import httpx
import asyncio
import aiohttp
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


@router.get('/')
# this whole thing returns a coroutine. how do I have it actually run it..?
async def basic_get():
    # make api call
    async with httpx.AsyncClient() as client:
        print(SPOONACULAR_API_KEY)
        r = await client.get(
            'https://api.spoonacular.com/recipes/complexSearch', 
            params={
                "apiKey": SPOONACULAR_API_KEY,
                "query": "tacos"
            }
        )
    # data = asyncio.run(r)
    # return info
    return {'data': r.json()} # json to serialize it upon return

async def get_api(session, url, params):
    #async with session.get(url + f'?apiKey={SPOONACULAR_API_KEY}&query=tacos') as response:
    #    return await response.text()
    async with session.get(url, params=params) as response:
        return await response.json() # returns dictionary of the results.

@router.get('/aihttp-version')
async def basic_get():
    # make api call - couldn't we just open the session in a dependency? like with get_db?
    # that way we don't have to write this code more than once
    async with CachedSession(cache=cache) as session:
        #async with aiohttp.ClientSession() as session:
        response = await get_api(
            session, 
            'https://api.spoonacular.com/recipes/complexSearch', 
            {"apiKey": SPOONACULAR_API_KEY, "query": "tacos"})
        # print(response.get('results')[0])
    return {'data': response} # json to serialize it upon return

@router.post('/')
async def create_cart():
    pass