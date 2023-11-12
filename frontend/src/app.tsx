import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "./theme";
import "@aws-amplify/ui-react/styles.css";

import { useAppState } from "./context/state";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@fontsource/poppins";
import ErrorDialog from "src/components/ErrorDialog/ErrorDialog";
import LoginPage from "src/components/LoginPage/LoginPage";
import PrivateRoute from "src/components/PrivateRoute/PrivateRoute";
import "src/types";

import { VideoProvider } from "src/components/VideoProvider";
import UnsupportedBrowserWarning from "src/components/UnsupportedBrowserWarning/UnsupportedBrowserWarning";
import MyCall from "./features/MyCallView";
import MyCalls from "./features/MyCallsView";
import Customer from "src/features/CustomerCallView/Customer";
import Expert from "src/features/ExpertCallView/Expert";
import MainMenu from "src/features/MainMenu";
import IncomingCallNotification from "./components/IncomingCallNotification/IncomingCallNotification";
import { InitializeSocketConnectionMessage } from "./features/api/socket/socket";
import SocketConnection from "./components/SocketConnection/SocketConnection";

interface VideoAppProps {
  profile: string;
}

function VideoApp({ profile }: VideoAppProps) {
  const { error, setError } = useAppState();

  return (
    <VideoProvider onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />

      {profile === "expert" ? <Expert /> : <Customer />}
    </VideoProvider>
  );
}

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <UnsupportedBrowserWarning>
          <Router>
            <Routes>
              <Route
                path="/call/"
                element={<SocketConnection authenticated={false} />}
              >
                <Route
                  path=":URLRoomName"
                  element={<VideoApp profile="customer" />}
                ></Route>
              </Route>
              <Route
                element={
                  <PrivateRoute>
                    <SocketConnection authenticated={true}></SocketConnection>
                  </PrivateRoute>
                }
              >
                <Route
                  path="/expertCall/:URLRoomName"
                  element={<VideoApp profile="expert" />}
                ></Route>

                <Route
                  path="/mycalls"
                  element={
                    <IncomingCallNotification>
                      <MainMenu></MainMenu>
                    </IncomingCallNotification>
                  }
                >
                  <Route path=":callID" element={<MyCall />}></Route>
                  <Route path="/mycalls/" element={<MyCalls />}></Route>
                </Route>
              </Route>

              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="" element={<LoginPage />}></Route>
            </Routes>
          </Router>
        </UnsupportedBrowserWarning>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
