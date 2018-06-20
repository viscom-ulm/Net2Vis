import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppRouter from './AppRouter.js';
import combinedReducers from './reducers';
import { loadNetwork } from './actions/Loaders.js';

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

store.dispatch(loadNetwork());

const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default App;
