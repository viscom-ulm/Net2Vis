import * as React from 'react';

import NetworkComponent from './Network';

class GraphComponent extends React.Component {

  render() {  
    return (
      <svg width="800" height="600">
        <NetworkComponent />
      </svg>
    );
  }
}
  
export default GraphComponent;
