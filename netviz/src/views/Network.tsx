import * as React from 'react';

class Network extends React.Component {

  render() {  
    return (
        <g>
          <line 
            x1="20"
            y1="500"
            x2="820"
            y2="500"
            stroke="green"
            stroke-width="2"
          />
          <line 
            x1="20"
            y1="0"
            x2="20"
            y2="500"
            stroke="green"
            stroke-width="2"
          />
          <path 
            d="M 20 500 L 40 440 L 60 400 L 80 460 L 100 180 L 380 400" 
            stroke="orange" 
            stroke-width="1"
            fill="none"
          />
        </g>
    );
  }
}
  
export default Network;
