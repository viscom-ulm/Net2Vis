import React from "react";

// Component for displaying the code of the Neural Network implementation
class Patterns extends React.Component {
  // Render the Code into the Code View if Toggled
  render() {
    return (
      // Editor with Syntax highlighting
      <defs id="main_defs">
        <pattern
          id="muster1"
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0L8 8ZM8 0L0 8Z" strokeWidth="0.5" stroke="black" />
        </pattern>
        <pattern
          id="muster2"
          x="10"
          y="10"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <rect width="10" height="10" />
          <rect x="10" y="10" width="10" height="10" />
        </pattern>
        <pattern
          id="muster3"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="5" />
        </pattern>
        <pattern
          id="muster4"
          x="10"
          y="10"
          width="10"
          height="10"
          patternTransform="scale(1,2) rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="5" height="5" />
          <rect x="5" y="5" width="5" height="5" />
        </pattern>
        <pattern
          id="muster5"
          x="10"
          y="10"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="5" />
        </pattern>
        <pattern
          id="muster6"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
            stroke="black"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="muster7"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
            stroke="black"
            strokeWidth="8"
          />
        </pattern>
        <pattern
          id="muster8"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
            stroke="black"
            strokeWidth="3"
          />
        </pattern>
        <pattern
          id="muster9"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="10" height="1" />
        </pattern>
        <pattern
          id="muster10"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="10" height="9" />
        </pattern>
        <pattern
          id="muster11"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="1" height="10" />
        </pattern>
        <pattern
          id="muster12"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="9" height="10" />
        </pattern>
      </defs>
    );
  }
}

export default Patterns;
