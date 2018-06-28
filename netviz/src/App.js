import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppRouter from './AppRouter';
import Controls from './components/ControlsComponent'
import combinedReducers from './reducers';
import { loadNetwork } from './actions/Loaders';

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)
console.log(store.getState()); 
store.dispatch(loadNetwork());

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
