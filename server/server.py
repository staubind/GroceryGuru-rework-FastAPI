from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
import requests

from dotenv import load_dotenv
import os

# get environment variables
load_dotenv(os.path.dirname(os.getcwd())+'/.env')

SPOONACULAR_API_KEY = os.environ.get('SPOONACULAR_API_KEY')

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
                "apiKey": os.environ.get('SPOONACULAR_API_KEY'),
                "query": "tacos"
            }
        )
    # data = asyncio.run(r)
    # return info
    return {'data': r.json()}