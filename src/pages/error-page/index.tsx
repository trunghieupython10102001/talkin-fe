import { Container } from "@mui/material";

import { Link } from "react-router-dom";
import { useStyles } from "./styles";
export const ErrorPage = () => {
  const classes = useStyles();
  return (
    <Container>
      <h1>Page Not Found</h1>
      <p>
        Back to{" "}
        <Link to="/" className={classes.activeLink}>
          Home page
        </Link>{" "}
      </p>
    </Container>
  );
};
