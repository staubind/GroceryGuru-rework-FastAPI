const express = require('express')
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router()
const axios = require('axios');
const addCurrentAndFavorites = require('../modules/addProps');
const cacheAxios = require('./cacheAxios');

router.get('/all', rejectUnauthenticated, (req, res) => {
    /*
        get all items in a users favorites
    */
    const sqlQuery = `SELECT ARRAY_AGG("recipe_id") AS "favorites" FROM "user_recipes"
                      WHERE "user_id" = $1 AND "is_favorite" = TRUE;`;
    const sqlParams = [req.user.id];
    pool.query(sqlQuery, sqlParams).then(dbResponse => {
        // if they have something in their favorites
        if (!!dbResponse.rows[0].favorites) {
            cacheAxios({
                method: 'GET',
                url: 'https://api.spoonacular.com/recipes/informationBulk',
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                    ids: dbResponse.rows[0].favorites.join(',')
                }
            }).then(async apiRes => { // async because we have to do some preprocessing of the data
                const preparedResults = await addCurrentAndFavorites(req.user.id, apiRes.data)
                if (preparedResults === 'addCurrentAndFavorites failed') {
                    console.log('addCurrentAndFavorites Failed.')
                    res.sendStatus(500);
                }
                res.send(preparedResults);
            }).catch(error => {
                console.log('Failed to retrieve all favorites info from spoonacular: ', error)
                res.sendStatus(500);
            })
        } else {
            res.send([]);
        }
    }).catch(error => {
        console.log('Failed to fetch all users favorites: ', error);
        res.sendStatus(500);
    });
})

router.get('/:userId/:recipeId/exist', rejectUnauthenticated, (req, res) => {
    /*
        Check if this recipe is a favorite of this user
    */
    const sqlQuery = `SELECT "is_favorite" from "user_recipes"
                      WHERE "user_id" = $1 and "recipe_id" = $2;`
    const sqlParams = [req.user.id, Number(req.params.recipeId)]; // cast data to the right type
    pool.query(sqlQuery, sqlParams).then(dbRes => {
        if (dbRes.rowCount) {
            res.send({exists: true})
        } else {
            res.send({exists: false})
        }
    }).catch(error => {
        console.log('Failed in db query about getting individual favorite: ', error)
        res.sendStatus(500);
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
    /*
        Add a new favorite recipe
    */
    const sqlQuery = `INSERT INTO "user_recipes"
                          ("user_id", "recipe_id", "is_favorite", "is_current", "servings")
                      VALUES
                          ($1, $2, TRUE, FALSE, 1)`;
    const sqlParams = [req.user.id, req.body.recipeId];
    pool.query(sqlQuery, sqlParams).then(dbRes => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('Failed to insert favorite into database');
        res.sendStatus(500);
    });
});

router.put('/', rejectUnauthenticated, (req, res) => {
    /*
        Update the favorite property of this recipe
    */
    const sqlQuery = `UPDATE "user_recipes"
                      SET "is_favorite" = NOT "is_favorite"
                      WHERE "user_id" = $1 AND "recipe_id" = $2`;
    const sqlParams = [req.user.id, Number(req.body.recipeId)];
    pool.query(sqlQuery, sqlParams).then(dbRes => {
        res.sendStatus(200);
    }).catch(error => {
        console.log('Failed to PUT favorite to db: ', error);
        res.sendStatus(500);
    })
});

module.exports = router