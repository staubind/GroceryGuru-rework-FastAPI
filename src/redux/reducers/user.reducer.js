const userReducer = (state = {}, action) => {
    /*
      for tracking which user we are working with
    */
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

export default userReducer;
