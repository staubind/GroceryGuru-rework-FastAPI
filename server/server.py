from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from routes import recipe_router
from dotenv import load_dotenv
import os

# db stuff
# from db import Base
# Base.metadata.create_all(bind=engine)

# end db stuff

# get environment variables
load_dotenv(os.path.dirname(os.getcwd())+'/.env')

SPOONACULAR_API_KEY = os.environ.get('SPOONACULAR_API_KEY')

app = FastAPI()

app.include_router(recipe_router.router)

origins = [
    "http://localhost:3000",
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




