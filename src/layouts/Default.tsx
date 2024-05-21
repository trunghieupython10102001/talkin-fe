import { Box, Container, Divider, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/header";
import { useStyles2 } from "./styles";

const DefaultLayout: React.FC = () => {
  const classes = useStyles2();

  return (
    <Box className={classes.defaulRoot}>
      <Header />
      <Container maxWidth="xl" className={classes.wrapperMain} component="main">
        <Outlet />
      </Container>
    </Box>
  );
};

export default DefaultLayout;
