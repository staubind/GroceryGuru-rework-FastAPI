import { takeLatest, put } from "@redux-saga/core/effects";
import axios from "axios";

function* fetchCart(action) {
    try {
        // axios call to get all cart items for that user
        const results = yield axios({
            method: 'GET',
            url: 'api/cart',
            params: {
                cart: action.payload
            }
        })
        // send them to the reducer
        yield put({
            type: 'SET_CART_REDUCER',
            payload: results.data
        })
    } catch (error) {
        console.log('Failed to fetch the cart: ', error);
        alert('Failed to fetch the cart. See the console for details.')
    }
};

function* addToCart(action) {
    try {
        yield axios({
            method: 'POST',
            url: `/api/cart/`,
            data: {
                user: action.payload.userId,
                recipeId: action.payload.recipeId,
                servings: action.payload.servings
            }
        })
        // do a get w/ the stuff that's in the search - we need to know their isCurrent status  
        const isCurrent = yield axios({
            method: 'GET',
            url: `/api/cart/${action.payload.recipeId}/isCurrent`,
        })
        // send update to reducer and update it
        yield put({
            type: 'UPDATE_SEARCH_REDUCER',
            payload: {
                recipeId: isCurrent.data.recipeId,
                isCurrent: isCurrent.data.isCurrent
            }
        })
        // need to update the cart reducer as well
        // just run the fetch cart again?
        yield fetchCart(action)
    } catch (error) {
        console.log('Failed to add to cart: ', error);
        alert('Failed to add to cart. See console for details.');
    }
}

function* removeFromCart(action) {
    console.log('actions value is: ', action);
    try {
        yield axios({
            method: 'DELETE',
            url: `/api/cart/`,
            data: {
                user: action.payload.userId,
                recipeId: action.payload.recipeId
            }
        })
        const isCurrent = yield axios({
            method: 'GET',
            url: `/api/cart/${action.payload.recipeId}/isCurrent`,
        })
        // send update to reducer and update it
        yield put({
            type: 'UPDATE_SEARCH_REDUCER',
            payload: {
                recipeId: isCurrent.data.recipeId,
                isCurrent: isCurrent.data.isCurrent
            }
        })
        // update cart reducer, too
        // just run fetch cart again.
        yield fetchCart(action);
    } catch (error) {
        console.log('Failed to remove from cart: ', error);
        alert('Failed to remove from cart. See console for details.');
    }
}

function* cartSaga(action) {
    yield takeLatest('FETCH_CART', fetchCart);
    yield takeLatest('ADD_TO_CART', addToCart);
    yield takeLatest('REMOVE_FROM_CART', removeFromCart);
}

export default cartSaga;