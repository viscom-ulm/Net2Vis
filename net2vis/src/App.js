import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import AppRouter from "./AppRouter";
import Controls from "./components/controls/ControlsComponent";
import combinedReducers from "./reducers";

import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";

// Create the Store using all the Reducers and applying the Middleware
const store = createStore(combinedReducers, applyMiddleware(thunk));

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
  typography: {
    useNextVariants: true,
  },
});

// Render the App
// The App provides the Store to the following components.
// Controls as well as Routed Content are rendered.
const App = () => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <div className="full">
        <CssBaseline />
        <header>
          <Controls />
        </header>
        <AppRouter />
      </div>
    </Provider>
  </ThemeProvider>
);

export default App;
