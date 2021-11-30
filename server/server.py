from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
import requests
import aiohttp
from aiohttp_client_cache import CachedSession, SQLiteBackend

from dotenv import load_dotenv
import os

# get environment variables
load_dotenv(os.path.dirname(os.getcwd())+'/.env')

SPOONACULAR_API_KEY = os.environ.get('SPOONACULAR_API_KEY')

cache = SQLiteBackend(
    cache_name='local_cache',
    expire_after=3600,
    ignored_params=['apiKey'] # uses cache response even if the token differs
)

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mock up of routes:

# /recipes/favorites/{user_id} -> get/post/put
# /recipes/cart/{user_id} -> get/post/put/delete
# /recipes -> get (for searching)

# really not sure about user routes
# users/login -> put?
# users/logout -> put?
# users/register -> post?

# use beaker for caching

@app.get('/')
# this whole thing returns a coroutine. how do I have it actually run it..?
async def basic_get():
    # make api call
    async with httpx.AsyncClient() as client:
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
        return await response.text()

@app.get('/aihttp-version')
async def basic_get():
    # make api call
    async with CachedSession(cache=cache) as session:
        #async with aiohttp.ClientSession() as session:
        response = await get_api(
            session, 
            'https://api.spoonacular.com/recipes/complexSearch', 
            {"apiKey": SPOONACULAR_API_KEY, "query": "tacos"})
    return {'data': response} # json to serialize it upon return

@app.post('/')
async def create_cart():
    pass