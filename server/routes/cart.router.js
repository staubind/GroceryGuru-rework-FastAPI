const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const axios = require('axios');
const addCurrentAndFavorites = require('../modules/addProps');
const cacheAxios = require('./cacheAxios');
const router = express.Router();

router.post('/', rejectUnauthenticated, (req, res) => {
    /*
        Post a new recipe to the user's cart
    */

    // check if the row exists in the database
    const updateSqlQuery = `UPDATE "user_recipes"
                            SET "is_current" = TRUE, "servings" = $1
                            WHERE "user_id" = $2 AND "recipe_id" = $3;`
    const updateSqlParams = [req.body.servings, req.user.id, req.body.recipeId]
    pool.query(updateSqlQuery, updateSqlParams)
    .then(existResponse => {
        // check if anything was updated
        if (existResponse.rowCount === 0) {
            // insert a new row
            const insertSqlQuery = `INSERT INTO "user_recipes"
                                        ("user_id", "recipe_id", "is_favorite", "is_current", "servings")
                                    VALUES
                                        ($1, $2, FALSE, TRUE, $3)`;
            const insertSqlParams = [req.user.id, req.body.recipeId, req.body.servings]
            pool.query(insertSqlQuery, insertSqlParams).then(dbResponse => {
                // send creation response
                res.sendStatus(201);
            }).catch(error => {
                console.log('Failed to create a new row in user_recipes: ', error);
                res. sendStatus(500);
            })
        } else {
            // successfully updated response
            res.sendStatus(204)
        }
    }).catch(error => {
        console.log('Failed to check if element exists in DB: ', error)
        res.sendStatus(500);
    })
});

router.delete('/', rejectUnauthenticated, (req, res) => {
    /*
        Do a soft delete using the "is_current" field
    */
    const sqlQuery = `UPDATE "user_recipes"
                      SET "is_current" = FALSE
                      WHERE "user_id" = $1 AND "recipe_id" = $2;`;
    const sqlParams = [req.user.id, req.body.recipeId];
    pool.query(sqlQuery, sqlParams).then(dbResponse => {
        res.sendStatus(204);
    }).catch(err => {
        console.log('Failed to remove item from cart: ', err)
        res.sendStatus(500);
    });
});

router.get('/:recipeId/isCurrent', rejectUnauthenticated, (req, res) => {
    /*
        Query db to find out if the recipe you're interested in isCurrent
    */
    const sqlQuery = `SELECT "is_current" FROM "user_recipes"
                      WHERE "user_id" = $1 and "recipe_id" = $2`
    const sqlParams = [req.user.id, req.params.recipeId];
    pool.query(sqlQuery, sqlParams).then(dbRes => {
        res.send({
            recipeId: req.params.recipeId,
            isCurrent: dbRes.rows[0].is_current
        })
    }).catch(error => {
        console.log('Failed to get is_current for updating of state');
        res.sendStatus(500);
    })
})

router.get('/', rejectUnauthenticated, (req, res) => {
    /*
        Retrieve the user's entire cart
    */
    const sqlQuery = `SELECT ARRAY_AGG("recipe_id") as "cart" FROM "user_recipes"
                      WHERE "user_id" = $1 AND "is_current" = TRUE`;
    const sqlParams = [req.user.id];
    pool.query(sqlQuery, sqlParams).then(async dbRes => {
        // call spoonacular api w/ appropriate info
        if (!!dbRes.rows[0].cart) {
            cacheAxios({
                method: 'GET',
                url: 'https://api.spoonacular.com/recipes/informationBulk',
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                    ids: dbRes.rows[0].cart.join(',')
                }
            }).then(async apiRes => { // function async because we need to process the results of the api call
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
        console.log('Failed to get cart contents: ', error);
        res.sendStatus(500);
    })

})
module.exports = router;