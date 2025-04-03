import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token"); 

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded?.userId,
        role: decoded?.role,
      });
    } catch (error) {
      console.error("Invalid token:", error);
    }

    setIsLoading(false);
  }, []);

  return { user, isLoading };
};

export default useAuth;
