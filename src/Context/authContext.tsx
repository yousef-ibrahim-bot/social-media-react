import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
 export type AuthContextType = {
  Token: string | null;
  UserId:" "
  addDataToToken: (tkn: string) => void;
  removeToken: () => void;
};

export const CreatedAuthenticationContext = createContext<
  AuthContextType | undefined
>(undefined);

export default function AuthContext({ children }: { children: ReactNode }) {
  const [Token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });
   const [UserId, setUserId] = useState(" ")

useEffect(() => {
     if(Token){
    const decoded = jwtDecode(Token)
    setUserId(decoded.user)
   }
  }
, [Token])


  function addDataToToken(tkn: string) {
    setToken(tkn);
    localStorage.setItem("token", tkn);

  }
  function removeToken() {
    setToken(null);
    localStorage.removeItem("token");
  }
  return (
    <CreatedAuthenticationContext.Provider value={{ Token, addDataToToken, removeToken ,UserId}}>
      {children}
    </CreatedAuthenticationContext.Provider>
  );
}
