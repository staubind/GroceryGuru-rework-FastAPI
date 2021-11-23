const axios = require('axios');
const setupCache = require('axios-cache-adapter').setupCache
/*
  This file sets up a cache so we don't use up API calls as quickly.
*/
const cache = setupCache({
    maxAge: 15 * 60 * 24 * 1000, // 24 hours for testing purposes
    debug: true,
    exclude: {
      query: false,
    }
})

const cacheAxios = axios.create({
    adapter: cache.adapter
})

module.exports = cacheAxios;