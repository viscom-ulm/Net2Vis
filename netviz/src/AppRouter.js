import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Network from './components/NetworkComponent';

class AppRouter extends React.Component {
  render() {
    return (
      <div className='content'>
        <Router>
          <Route exact={true} path="/" component={Network} />
        </Router>
      </div>
    );
  }    
}

export default AppRouter;
