import { Paths } from "@/constants/path";
import { useAppSelector } from "@/hooks";
import { type ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Auth: React.FC<{
  unAuthElement: ReactElement;
}> = ({ unAuthElement }) => {
  const loggedIn = useAppSelector((state) => state.auth.isLogged);

  const { pathname } = useLocation();

  if (!loggedIn) {
    if (pathname === Paths.Home) return unAuthElement;

    return <Navigate to={Paths.Login} />;
  }

  return <Outlet />;
};

export default Auth;
