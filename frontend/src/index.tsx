import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import SocketContextProvider from "./context/socketContext/socketContext";
import AppStateProvider from "./context/state";

ReactDOM.render(
  <SocketContextProvider>
    <AppStateProvider>
      <App></App>
    </AppStateProvider>
  </SocketContextProvider>,
  document.getElementById("root")
);
