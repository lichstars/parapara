import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './state/reducer';
import App from './App';

import './index.css';

const reducers = combineReducers({
  app: appReducer,
  form: formReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  reducers,
  composeEnhancer(applyMiddleware(thunk)),
);

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
