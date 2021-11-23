import { useSelector } from 'react-redux';
import RecipeReviewCard from '../RecipeCard/RecipeCard2';

function Search() {
    /*
        Displays the results of the search - search is handled in the NavigationBar top
    */
    const searchResults = useSelector(store => store.search);     
    const searchTerm = useSelector(store => store.searchTermReducer);

    return (
        <center>
            {/* 
            Using center tags for mobile display. 
            Displays the search results on recipecards
            */}
            <br></br>
            { searchTerm ? <h1>{searchTerm}</h1> : <h1>Try Searching for new recipes!</h1>}
            <hr></hr>
            {searchResults.map(recipe => {
                return <div><RecipeReviewCard key={recipe.id} recipe={recipe}/><br></br></div>
            })}            
        </center>
    );
}; 

export default Search 