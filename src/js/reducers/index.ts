import {combineReducers, createStore} from 'redux';
import userReducer from './user';

const rootReducer = combineReducers({
    userReducer,
});

export const store = createStore(rootReducer);