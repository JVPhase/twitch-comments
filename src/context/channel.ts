import { createContext, useContext } from 'react';

export const ChannelContext = createContext({} as any);

export function useChannel() {
  return useContext(ChannelContext);
}