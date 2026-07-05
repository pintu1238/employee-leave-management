/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default AuthContext;