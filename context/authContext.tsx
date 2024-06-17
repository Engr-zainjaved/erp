import { createContext, useState, ReactNode } from "react";
import UserImage from "../assets/img/wanna/wanna1.png";

// Define interface for response data
interface ResponseData {
  refresh: string;
  access: string;
  avatar_url: string;
  id: number | null;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  login_type: string;
}

// Define interface for user data
interface UserData {
  message: string;
  data: ResponseData;
  error: boolean;
}

// Set initial context value
const initialContextValue: UserData = {
  message: "User Authenticated Successfully",
  data: {
    refresh: "",
    access: "",
    avatar_url: UserImage,
    id: null,
    username: "",
    first_name: "User",
    last_name: "Name",
    email: "",
    login_type: "",
  },
  error: false,
};

// Create the context
const authContext = createContext<{
  authData: UserData;
  setAuthContext: (responseData: ResponseData) => void;
}>({
  authData: initialContextValue,
  setAuthContext: () => {},
});

// Create AuthProvider component
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<UserData>(initialContextValue);

  const setAuthContext = (responseData: ResponseData) => {
    setAuthData({
      message: "User Authenticated Successfully",
      data: responseData,
      error: false,
    });
  };

  return (
    <authContext.Provider value={{ authData, setAuthContext }}>{children}</authContext.Provider>
  );
};

// Export the context
export default authContext;
