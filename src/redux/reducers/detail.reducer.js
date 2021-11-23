const detailReducer = (state = {}, action)  => {
    switch(action.type) {
        case 'SET_DETAIL_REDUCER':
            return action.payload;
        default:
            return state;
    }
}

export default detailReducer;