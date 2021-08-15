import { createContext, useContext } from "react";
import io from "socket.io-client";
import { host } from '../consts'

export const socket = io(`${host}/`, { path: "/socket/", reconnection: false });

export const SocketContext = createContext(socket as any);

export function useSocket() {
  return useContext(SocketContext);
}

