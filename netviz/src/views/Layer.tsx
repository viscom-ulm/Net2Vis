import * as React from 'react';
import { connect } from 'react-redux';

import { Network } from '../types/NetworkTypes';
import { StoreProps } from '../types';

interface StateProps {
  network: Network;
}

class LayerComponent extends React.Component<StateProps, {}> {
  
  constructor(props: StateProps) {
    super(props);
  }

  render() {  
    return (
      <rect width="300" height="100" x="100" y="100" />
    );
  }
}

const mapStateToProps = ({
  network
}: StoreProps) => ({
  network
});

export default connect(mapStateToProps)(LayerComponent);
