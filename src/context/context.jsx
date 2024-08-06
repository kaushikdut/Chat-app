import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);
export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const [chats, setChats] = useState();
  const [selectedChat, setSelectedChat] = useState();

  6;
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        token,
        setToken,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
