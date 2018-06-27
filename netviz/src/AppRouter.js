import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Network from './components/NetworkComponent';

class AppRouter extends React.Component {
  render() {
    return (
      <div className='full'>
        <Router>
          <div className='full'>
            <Route exact={true} path="/" component={Network} />
          </div>
        </Router>
      </div>
    );
  }    
}

export default AppRouter;
