import { authActions } from "@/store/authSlice";
import { useAppDispatch } from "./store";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logoutAction());
    navigate('/');
  };
  return {
    handleLogout,
  };
};
