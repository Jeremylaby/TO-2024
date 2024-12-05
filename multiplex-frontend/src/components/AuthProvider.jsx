import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        } );
        console.log("Pomyślnie zalogowano!");
        return true;
      } else {
        const errorText = await response.text();
        console.log("Błąd logowania:", errorText);
        return false;
      }
    } catch (error) {
      console.log("Wystąpił błąd podczas logowania:", error);
      return false;
    }
  };
  

  const signUp = async (firstName, lastName, email, password) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
  
      if (response.ok) {
        const loginSuccess = await login(email, password);
        return loginSuccess;
      } else {
        const errorText = await response.text();
        console.error("Błąd rejestracji:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas rejestracji:", error);
      return false;
    }
  };

  const logout = async () => {
    //TODO
  };

  const checkAuth = async () => {
    //TODO
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
