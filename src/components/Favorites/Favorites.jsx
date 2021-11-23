import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeCard2 from '../RecipeCard/RecipeCard2';

function Favorites() {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favoriteReducer);
    // on load: get all favorites for the user

    useEffect(() => {
        /*
        for when I return to this project: - make it load immediately, caching will take care of this
        
        if we do this on load, everytime they go to the page it'll run all of the api calls
        need a different solution to avoid unnecessary api calls
        on each call to favorites:
                we'll send the list from the front end of what's currently in favorites reducer.
                check for differences between f.e.state and database
                only do an api call for the difference to minimize api point impact
                then send result to favorites
                rerender the component
        */

        dispatch({
            type: 'FETCH_ALL_FAVORITES',
            payload: []
        })
    }, [])

    // display the list of recipe cards in return
    return (
        <center>
            {favorites.map(recipe => {
                return <div><RecipeCard2 key={recipe.id} recipe={recipe}/><br></br></div>
            })}       
        </center>
    );
}

export default Favorites;