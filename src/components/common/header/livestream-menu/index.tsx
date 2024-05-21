import React from "react";
import { useStyles } from "./styles";
import { Button, InputAdornment, Menu, MenuItem, TextField } from "@mui/material";
import { ReactComponent as SearchIcon } from "@/assets/svg/search.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Paths } from "@/constants/path";
import { livestreamActions } from "@/store/livestreamSlice";
import dispatchCustomEvent from "@/utils/dispatchCustomEvent";
import { EEVENT_NAME } from "@/constants";

export default function LiveStreamMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();

  const { isLogged } = useAppSelector((state) => state.auth);
  const { searchText } = useAppSelector((state) => state.livestream);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type: string) => {
    navigate(type);
    setAnchorEl(null);
  };

  const handleExplore = () => {
    navigate(Paths.LiveStreamFilter);
    appDispatch(
      livestreamActions.setParams({
        page: 1,
        name_like: "",
        "creator.fullname_like": "",
        status: "",
        listCategory_has: [],
      })
    );
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const value = e.target.value;

    dispatchCustomEvent(EEVENT_NAME.UPDATE_SEARCH, {
      value,
    });

    appDispatch(livestreamActions.setSearchText(value));
  };

  return (
    <div className={classes.livestreamMenu}>
      <TextField
        margin="normal"
        fullWidth
        variant="outlined"
        placeholder="Search"
        name="search"
        value={searchText}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" className={classes.iconSearch}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        className={classes.search}
        // onKeyUp={handleKeyPress}
        onChange={handleOnChange}
      />

      <Button variant="outlined" className={classes.explore} onClick={handleExplore}>
        Explore
      </Button>
      {isLogged && (
        <Button variant="contained" className={classes.goLive} onClick={handleClick}>
          Go Live
        </Button>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        className={classes.menu}
      >
        <MenuItem onClick={() => handleClose(Paths.CreateLiveStream)} className={classes.menuItem}>
          <Link to={Paths.CreateLiveStream}>Start an instant livestream</Link>
        </MenuItem>
        <MenuItem onClick={() => handleClose(Paths.LSSchedule)} className={classes.menuItem}>
          <Link to={Paths.LSSchedule}>Schedule a livestream </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
