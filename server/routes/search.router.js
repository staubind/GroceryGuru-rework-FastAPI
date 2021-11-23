const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');
const addCurrentAndFavorites = require('../modules/addProps')
const cacheAxios = require('./cacheAxios');

router.get('/', (req, res) => {
    /*
        Retrieve search results for the requested term
    */
  cacheAxios({
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/complexSearch', 
    params: {
        // grabs the api key from environment variables to keep our key secure
        apiKey: process.env.SPOONACULAR_API_KEY,
        query: req.query.searchTerm,
        number: 10, // number of results
        fillIngredients: true,
        addRecipeInformation: true,
    }
  })
  .then(async apiResponse => { // async because preprocessing data before sending it to the front end
    const preparedResults = await addCurrentAndFavorites(req.user.id, apiResponse.data.results)
    if (preparedResults === 'addCurrentAndFavorites failed') {
      console.log('addCurrentAndFavorites Failed.')
      res.sendStatus(500);
    }
    res.send(preparedResults)
  }).catch( error => {
      console.log('Spoonacular api request failed: ', error)
      res.sendStatus(500);
  })
});

module.exports = router;
