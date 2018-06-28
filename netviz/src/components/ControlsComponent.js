import * as React from 'react';

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

export default Controls;
