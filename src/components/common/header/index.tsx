import * as React from "react";
import classNames from "classnames";
import { authAsyncActions } from "@/store/authSlice";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useStyles } from "./styled";
import Timestamp from "@/components/common/Timestamp";
import { Paths } from "@/constants/path";
import { useLogout } from "@/hooks/use-logout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Logo from "@/assets/images/talkin-logo.png";

const Header: React.FC = () => {
  const classes = useStyles();
  const { isLogged } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const { handleLogout } = useLogout();
  const profile = useAppSelector((state) => state.auth.profile);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = () => {
    handleCloseUserMenu();
    handleLogout();
  };

  const navigateMyprofile = () => {
    navigate(Paths.MyProfile);
    handleCloseUserMenu();
  };

  React.useEffect(() => {
    if (isLogged) {
      dispatch(authAsyncActions.getProfileAction());
    }
  }, [isLogged, dispatch]);

  return (
    <AppBar position="static" className={classes.headerContainer}>
      <Container maxWidth="xl" className={classes.main}>
        <Toolbar disableGutters>
          {/* Mobile */}
          <Link to="/">
            <Box className={classes.logoContainer}>
              <Box className={classes.logo}>
                <img src={Logo} alt="" />
              </Box>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              classes={{
                paper: classes.menuMobile,
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            ></Menu>
          </Box>

          {/* Desktop */}
          <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
            <Link to="/">
              <Box className={classes.logoContainer}>
                <Box className={classes.logo}>
                  <img src={Logo} alt="" />
                </Box>
              </Box>
            </Link>
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            noWrap
            className={classNames(classes.siteName, classes.siteNameMobile)}
          >
            Talkin
          </Typography>
          <Box component="div" className={classes.menuDesktop}></Box>
          <Timestamp />
          {isLogged && (
            <Box sx={{ flexGrow: 0 }} className={classes.avatar}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src={`${process.env.REACT_APP_BE_BASE_URL}/${profile.avatar}`} alt="Remy Sharp" />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar-settings"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PopoverClasses={{ paper: classes.dropdownMenu }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={navigateMyprofile}>
                  <Typography textAlign="center">My profile</Typography>
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <Typography textAlign="center">Log out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
