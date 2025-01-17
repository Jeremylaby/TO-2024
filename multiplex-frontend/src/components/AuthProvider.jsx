import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });
  
      if (response.ok) {
        await checkAuth()
        console.log("Pomyślnie zalogowano!");
        return true;
      } else {
        const errorText = await response.json();
        console.log("Błąd logowania:", errorText);
        alert("Login error: "+ errorText.error)
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
    try{
      const response = await fetch("/auth/logout",{
        method: "POST",
        credentials: "include",
      })
      if (response.ok){
        console.log("Wylogowano!");
        alert("Logged out");
        setUser(null);
        return true
      }else{
        console.error("Błąd podczas wylogowywania");
        alert("Logout error")
      }
    }catch (error) {
      console.error("Wystąpił błąd podczas wylogowania:", error);
      alert("Logout error: "+ error)
      return false
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch("/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Błąd sprawdzania sesji:", error);
    }
  };


  useEffect(() => {
    checkAuth();
  }, []);

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
