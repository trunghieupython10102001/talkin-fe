import React from "react";
import { Outlet } from "react-router-dom";
import SnackbarComponent from "@/components/common/snackbar";

const Void: React.FC = () => {
  return (
    <>
      <Outlet />
      <SnackbarComponent />
    </>
  );
};

export default Void;
