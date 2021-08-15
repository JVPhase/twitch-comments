import { createContext, useContext } from 'react';

export const AuthContext = createContext({} as any);

export function useAuth() {
  return useContext(AuthContext);
}