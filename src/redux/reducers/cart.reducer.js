const cartReducer = (state = [], action)  => {
    /*
        Reducer for tracking what's in our cart
    */
    switch(action.type) {
        case 'SET_CART_REDUCER':
            return [...action.payload];
        default:
            return state;
    }
}

export default cartReducer