import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export const initialState = {
  language: 'en',
};

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
