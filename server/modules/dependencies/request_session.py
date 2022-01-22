from aiohttp_client_cache import CachedSession, SQLiteBackend

cache = SQLiteBackend(
    cache_name='local_cache',
    expire_after=3600,
    ignored_params=['apiKey'] # uses cache response even if the token differs
)
    
async def get_req_session():
    async with CachedSession(cache=cache) as session:
        yield session