import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
import { useDispatch } from "react-redux";
import fetchCart from './cart.saga';


function* changeFavorite(action) {
    try {
        // send to search state reducer
        const inDatabase = yield axios({
            method: 'GET',
            url: `/api/favorite/${action.payload.userId}/${action.payload.recipeId}/exist`
        })
        if (inDatabase.data.exists) {
            // update it if it's in the db
            yield axios({
                method: 'PUT',
                url: '/api/favorite',
                data: {
                    userId: action.payload.userId,
                    recipeId: action.payload.recipeId
                }
            })
        } else {
            // post it if it isn't in the db
            yield axios({
                method: 'POST',
                url: '/api/favorite',
                data: {
                    userId: action.payload.userId,
                    recipeId: action.payload.recipeId
                }
            })
        }
        // get the value from the db
        // now we KNOW it exists
        const isFavorite = yield axios({
            method: 'GET',
            url: `/api/favorite/${action.payload.userId}/${action.payload.recipeId}`
        })
        // update search state w/ the value
        yield put({
            type: 'UPDATE_FAVORITE',
            payload: {
                isFavorite: isFavorite.data,
                recipeId: action.payload.recipeId
            }
        })
            // dispatch to fetch_all_favorites
        yield fetchAllFavorites(action)
            // dispatch to fetch_cart
        yield fetchCart(action)
    } catch (error) {
        console.log('Failed to set Favorites: ', error);
        alert('Failed to set Favorites. See console for details.')
    }
};

function* fetchAllFavorites(action) {
    try {
        const results = yield axios({
            method: 'GET',
            url: '/api/favorite/all',
            params: {
                favorites: action.payload 
            }
        })
        // put to the reducer
        yield put({
            type: 'SET_FAVORITE_REDUCER',
            payload: results.data
        })
    } catch (error) {
        console.log('Failed to fetch all favorites for this user: ', error);
        alert('Failed to fetch all favorites. See console for details: ', error);
    }
}

function* favoriteSaga(action) {
    yield takeEvery('CHANGE_RECIPE_FAVORITE', changeFavorite);
    yield takeEvery('FETCH_ALL_FAVORITES', fetchAllFavorites)
};

export default favoriteSaga;