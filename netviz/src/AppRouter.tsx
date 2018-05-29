import * as React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Graph from './views/Graph';

class AppRouter extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Route exact={true} path="/" component={Graph} />
                    </div>
                </Router>
            </div>
        );
    }    
}

export default AppRouter;
