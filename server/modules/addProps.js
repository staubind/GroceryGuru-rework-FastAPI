const pool = require('./pool');

async function addCurrentAndFavorites(userId, recipeList) {
    /*
    this function checks if the search results exist in the db for that user
    and if they are already in the user's cart
    we need this to do some conditional rendering on the front end
    */
    for (let i = 0; i < recipeList.length; i++) {
        recipe = recipeList[i]
        recipe['isCurrent'] = false
        recipe['isFavorite'] = false
        const query = `SELECT "is_current", "is_favorite" FROM "user_recipes"
                       WHERE "user_id" = $1 AND "recipe_id" = $2`
        const params = [userId, recipe.id]
        // see if it exists in the db
        await pool.query(query, params).then(dbResponse => {
            if (dbResponse.rowCount !== 0) {
                recipe['isCurrent'] = dbResponse.rows[0].is_current        
                recipe['isFavorite'] = dbResponse.rows[0].is_favorite
            } 
            // if exists give it value from db
            recipeList[i] = recipe
        }).catch(error => {
            console.log('Failed to decide if recipe is current or not: ', error);
            return 'addCurrentAndFavorites';
        })
    }
    return recipeList
}

    module.exports = addCurrentAndFavorites