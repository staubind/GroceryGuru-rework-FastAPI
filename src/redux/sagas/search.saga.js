import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';



function* search(action) {
    try {
        const results = yield axios.get('/api/search', {params:  {searchTerm: action.payload}})
        yield put({
            type: 'SET_SEARCH_TERM',
            payload: action.payload})
        yield put({
            type: 'SET_SEARCH_REDUCER', 
            payload: results})
    } catch (error) {
        console.log('Failed to search: ', error);
        alert('Failed to search. See console for details.');
    }
}

function* searchSaga(action) {
    yield takeLatest('SEARCH', search)
}

export default searchSaga;