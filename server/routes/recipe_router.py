from fastapi import APIRouter
from dotenv import load_dotenv
import os
import httpx
import asyncio

router = APIRouter(
    prefix='/recipes',
    tags=['recipes'],
    responses={404: {"description": "Not Found"}}
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