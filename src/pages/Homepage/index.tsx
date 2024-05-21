import React from "react";
import Dashboard from "./Dashboard";
import Home from "./Home";
import { useAppSelector } from "@/hooks";

const Homepage: React.FC = () => {
  const loggedIn = useAppSelector((state) => state.auth.isLogged);

  return loggedIn ? <Dashboard /> : <Home />;
};

export default Homepage;
