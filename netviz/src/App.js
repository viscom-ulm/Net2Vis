import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppRouter from './AppRouter';
import Controls from './components/controls/ControlsComponent'
import combinedReducers from './reducers';

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

const App = () => (
  <Provider store={store}>
    <div className='full'>
      <header>
        <Controls/>
      </header>
      <AppRouter />
    </div>
  </Provider>
);

export default App;
