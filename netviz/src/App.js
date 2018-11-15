import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppRouter from './AppRouter';
import Controls from './components/controls/ControlsComponent'
import combinedReducers from './reducers';

// Create the Store using all the Reducers and applying the Middleware
const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

// Render the App
// The App provides the Store to the following components.
// Controls as well as Routed Content are rendered.
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
