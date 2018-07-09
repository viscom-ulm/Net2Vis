import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Main from './components/MainComponent';

// AppRouter Calling other Components dependant on Route
class AppRouter extends React.Component {
  render() {
    return (
      <div className='content'>
        <Router>
          <Route exact={true} path="/" component={Main} />
        </Router>
      </div>
    );
  }    
}

export default AppRouter;
