const searchReducer = (state = [], action) => {
    /*
        Creates a Reducer to house our search results from Spoonacular
    */
    switch (action.type) {
      case 'SET_SEARCH_REDUCER':
        return action.payload.data;
      case 'UPDATE_SEARCH_REDUCER':
        let newState = [...state]
        let index = newState.findIndex(recipe => recipe.id === Number(action.payload.recipeId))
        if (index > -1) {
        newState[index].isCurrent = action.payload.isCurrent
        }
        // return the object
        return newState
      case 'UPDATE_FAVORITE':
        newState = [...state]
        index = newState.findIndex(recipe => recipe.id === Number(action.payload.recipeId))
        newState[index].isFavorite = action.payload.isFavorite
        return newState;
      case 'CLEAR_SEARCH':
        return []
      default:
        return state;
    }
  };
  
  export default searchReducer;
  