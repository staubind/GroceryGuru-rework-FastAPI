from fastapi.security import OAuth2PasswordBearer
# This parameter contains the URL that the client (the frontend running in the user's browser) will use to send the username and password in order to get a token
# This parameter doesn't create that endpoint / path operation, but declares that the URL /token will be the one that the client should use to get the token. 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

# @app.get("/items/")
# This dependency will provide a str that is assigned to the parameter token of the path operation function.
# Looks for the Authorization header, checks if value is Bearer and some token, then returns the token as a string
# async def read_items(token: str = Depends(oauth2_scheme)):
#     return {"token": token}
