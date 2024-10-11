import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("decoded token: ", decodedToken);
      setUser({
        token,
        role: decodedToken.user.role,
        userId: decodedToken.user.id,
      });
    }
    setLoading(false);
  }, []);

  console.log("auth user: ", user);
  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    const newData = {
      token,
      role: decodedToken.user.role,
      userId: decodedToken.user.id,
    };
    setUser(newData);
    return newData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
