import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { initialState } from './initialState';
import rootReducer from './reducer';

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;
