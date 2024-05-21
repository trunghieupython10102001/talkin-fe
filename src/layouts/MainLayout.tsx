import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { useStyle1 } from "./styles";

import GaleryLayoutSrc from "@/assets/images/galery-layout.png";

export default function MainLayout() {
  const classes = useStyle1();

  return (
    <Box className={classes.layoutContainer}>
      <Box>
        <Outlet />
      </Box>
      <Box className={classes.boxGallery}>
        <img src={GaleryLayoutSrc} alt="galery-layout" />
      </Box>
    </Box>
  );
}
