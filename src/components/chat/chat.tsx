import React, { useEffect } from "react";
import io from "socket.io-client";
import { host } from "../../consts";
import { useAuth } from "../../context/auth";

export function Chat() {
  const { accessToken } = useAuth();

  useEffect(() => {
    const socket = io(`${host}/`, { path: "/socket/", reconnection: false });
    socket.emit("handshake", accessToken);
    socket.on("twitch is connected", (arg) => {
      console.log(arg);
    });

    socket.on("message", (arg) => {
      console.log(arg);
    });
  }, [accessToken]);

  return <div>lol chat</div>;
}
export default Chat;
