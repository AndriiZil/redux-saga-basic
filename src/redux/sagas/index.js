import { takeEvery, put, call, fork, spawn, select } from 'redux-saga/effects'; // fork is not blocked effect

// call and takeEvery are sync effects

async function swapiGet(pattern) {
    try {
        const request = await fetch(`https://swapi.dev/api/${pattern}`);
        const json = await request.json();

        return json;
    } catch (err) {
        console.log(err);
    }
}

export function* loadPeople() {
    // throw new Error('Error');
    const people = yield call(swapiGet, 'people');
    yield put({ type: 'SET_PEOPLE', payload: people.results });

    console.log('Load people!');
}

export function* loadPlanets() {
    const planets = yield call(swapiGet, 'planets');
    yield put({ type: 'SET_PLANETS', payload: planets.results });

    console.log('load planets!');
}

export function* workerSaga() {
    console.log('run parallel tasks');

    yield spawn(loadPeople); // instead using call which works sync
    yield spawn(loadPlanets); // instead using call which works sync

    const store = yield select(store => store);
    console.log('Store', store);

    console.log('finish parallel tasks');
}

export function*  watchLoadDataSaga() {
    yield takeEvery('LOAD_DATA', workerSaga);
}

export default function* rootSaga() {
    // yield watchClickSaga();
    yield fork(watchLoadDataSaga);
}

// When we will use "fork" effect and an error occurred into the one of the async function the other next func doesn't work
// When we use effect "spawn" only method where is error occurred will not work
// We can pause not blocked effects for example (fork, spawn) using "join" effect
