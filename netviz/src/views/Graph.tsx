import * as React from 'react';

import Network from './Network';

class Graph extends React.Component {

  render() {  
    return (
      <svg width="800" height="600">
        <Network />
      </svg>
    );
  }
}
  
export default Graph;
