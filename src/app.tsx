import React, { useState } from "react";
import Auth from "./components/auth/auth";
import Chat from "./components/chat/chat";
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import PrivateRoute from "./components/private-router/private-router";
import { AuthContext } from "./context/auth";
import axios from "axios";
import logo from "./logo.svg";
import "./App.scss";
import { ApiClient, UserIdResolvable } from "twitch";
import { StaticAuthProvider } from "twitch-auth";
import { ChatClient, PrivateMessage } from "twitch-chat-client";

const outerTheme = createMuiTheme({});

function App() {
  let clientId: string;
  const currentScopes = ["chat:read", "chat:edit"];
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState("");

  axios.get("/client").then((res) => {
    clientId = res.data.client_id;
  });

  if (!code && new URLSearchParams(window.location.search).get("code")) {
    setCode(
      (new URLSearchParams(window.location.search).get("code") as string) || ""
    );
  }
  console.log("code", code);

  const auth = () => {
    axios.post(`/login/${code}`).then((res) => {
      setAccessToken(res.data.access_token);
    });
  };

  const chat = async () => {
    const authProvider = new StaticAuthProvider(
      clientId,
      accessToken,
      currentScopes
    );
    const apiClient = new ApiClient({ authProvider });
    const chatClient = new ChatClient(authProvider, { channels: ["insym"] });
    await chatClient.connect();
    chatClient.onMessage(
      async (
        channel: string,
        user: string,
        message: string,
        msg: PrivateMessage
      ) => {
        console.log(msg, message, user, channel);
        if (message === "!followage") {
          const follow = await apiClient.kraken.users.getFollowedChannel(
            msg.userInfo.userId as UserIdResolvable,
            msg.channelId as UserIdResolvable
          );
          if (follow) {
            const currentTimestamp = Date.now();
            const followStartTimestamp = follow.followDate.getTime();
            chatClient.say(
              channel,
              `@${user} You have been following for ${
                (currentTimestamp - followStartTimestamp) / 1000
              }!`
            );
          } else {
            chatClient.say(channel, `@${user} You are not following!`);
          }
        }
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href={`/auth`}>
          Login twitch
        </a>
        <button className="App-link" onClick={auth}>
          Get tokens twitch
        </button>
        <button className="App-link" onClick={chat}>
          Chat
        </button>
      </header>
      <ThemeProvider theme={outerTheme}>
        <AuthContext.Provider value={{ accessToken, setAuthTokens: auth }}>
          <BrowserRouter>
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/" component={Chat} />
          </BrowserRouter>
        </AuthContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
