import React, { useState } from "react";
import Auth from "./components/auth/auth";
import Chat from "./components/chat/chat";
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/private-router/private-router";
import { AuthContext } from "./context/auth";

import "./app.module.scss";
// import { ApiClient, UserIdResolvable } from "twitch";
// import { StaticAuthProvider } from "twitch-auth";
// import { ChatClient, PrivateMessage } from "twitch-chat-client";

const outerTheme = createMuiTheme({});

function App() {
  // let clientId: string;
  // const currentScopes = ["chat:read", "chat:edit"];
  // const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const setTokens = (data: React.SetStateAction<string>) => {
    setAccessToken(data);
  };

  return (
    <div>
      <ThemeProvider theme={outerTheme}>
        <AuthContext.Provider
          value={{ accessToken, setAccessToken: setTokens }}
        >
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Auth} />
              <PrivateRoute path="/chat" component={Chat} />
              <Redirect to="/chat" />
            </Switch>
          </BrowserRouter>
        </AuthContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
