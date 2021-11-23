const favoriteReducer = (state = [], action)  => {
    switch(action.type) {
        case 'SET_FAVORITE_REDUCER':
            return [...action.payload];
        default:
            return state;
    }
}

export default favoriteReducer