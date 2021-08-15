import React, { useEffect } from "react";
import io from "socket.io-client";
import { host } from "../../consts";
import { useAuth } from "../../context/auth";
import { useChannel } from "../../context/channel";

export function Chat() {
  const { accessToken } = useAuth();
  const { channel } = useChannel();

  useEffect(() => {
    const socket = io(`${host}/`, { path: "/socket/", reconnection: false });
    socket.emit("handshake", accessToken, channel);
    socket.on("twitch is connected", (arg) => {
      console.log(arg);
    });

    socket.on("message", (arg) => {
      console.log(arg);
    });
  }, [accessToken, channel]);

  return <div>lol chat</div>;
}
export default Chat;
