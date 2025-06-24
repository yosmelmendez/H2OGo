import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null cuando no está logueado

  // Esto puede ser usado para persistir la sesión con localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error leyendo user/token del localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (userData) => {
    // <--- Only accept 'userData'
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Check if userData contains a token property and save it
    if (userData && userData.token) {
      // <--- Access token from userData
      localStorage.setItem("token", userData.token);
    } else {
      // Optional: If for some reason userData might not contain a token (e.g., guest login setup)
      // you might want to explicitly remove the token or log a warning.
      console.warn(
        "Login function called without a 'token' property in userData. Token in localStorage might not be updated."
      );
      // localStorage.removeItem("token"); // Uncomment if you want to clear token if not provided
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    // A user is considered authenticated if the 'user' state is not null
    // AND there's a token in localStorage.
    // This is a client-side check. For critical actions, always verify on the backend.
    return !!user && !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
