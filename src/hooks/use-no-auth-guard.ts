import { COOKIES_STORAGE_KEY } from "@/constants";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useNoAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get(COOKIES_STORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      navigate("/");
    }
  }, [navigate]);
};
