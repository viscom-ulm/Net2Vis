import * as React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Controls extends React.Component {
  render() {
    return(
      <ul>
        <li><a id='btnExecute'>Execute</a></li>
        <li><a id="btnClear">Clear</a></li>
        <li><a id="btnSave">Save</a></li>
        <li><a id="btnLoad">Load</a></li>
        <li><a id="btnUpload">Upload</a></li>
      </ul>
    );
  }
}

Controls.propTypes = {
  display: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    display: state.display
  };
}

export default connect(mapStateToProps, undefined)(Controls);
