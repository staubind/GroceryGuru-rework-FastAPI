import { put, takeLatest } from "redux-saga/effects";

function* detail(action) {
    try {
        yield put({
            type: 'SET_DETAIL_REDUCER',
            payload: action.payload
        })
    } catch (error) {
        console.log('Failed to dispatch to detail reducer');
        alert('Failed to dispatch to detail. See console for details.');
    }
};

function* detailSaga(action) {
    yield takeLatest('UPDATE_DETAIL_REDUCER', detail)
}

export default detailSaga;