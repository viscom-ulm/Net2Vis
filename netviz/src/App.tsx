import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './App.css';

import AppRouter from './AppRouter';
import { StoreProps } from './types';
import { combinedReducers, initialNetworkState } from './reducers';

const initialState: StoreProps = {
  network: initialNetworkState
};

const store = createStore(
  combinedReducers,
  initialState,
  applyMiddleware(thunk),
);

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default App;
