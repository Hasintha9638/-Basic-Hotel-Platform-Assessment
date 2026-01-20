import { createContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { login as loginApi } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState( null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);


  const login = async (username, password) => {
    try {
        const data = await loginApi(username, password);
        const { access_token, userdata} = data;
        // Handle userdata as string and convert to object
        const user = typeof userdata === 'string' ? { username: userdata } : userdata;
        setUser(user);
        setToken(access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        console.log("Login successful:", user);
        return {success: true};
        
    } catch (error) {
       console.error("Login error:", error);
       return {success: false, message: error.response?.data?.detail || "Login failed"}; 
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}