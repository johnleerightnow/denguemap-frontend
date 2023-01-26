import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { LoginContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    handleClose();
    setLoggedIn(false);
  };

  return (
    <Box sx={{ flexGrow: 1, width: "90vw" }}>
      <AppBar style={{ background: "#2E3B55" }} position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/")}
          >
            Dengue Map
          </Typography>
          {/* TODO make icon common */}
          <>
            <IconButton
              size="large"
              color="inherit"
              aria-controls="menu-appbar"
              aria-label="menu"
              aria-haspopup="true"
              sx={{ mr: 2 }}
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {loggedIn ? (
                <div>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>About</MenuItem>
                  <MenuItem onClick={handleClose}>Dengue Info</MenuItem>
                  <MenuItem onClick={handleClose}>Contact</MenuItem>
                  <MenuItem onClick={logOut}>Log Out</MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={() => navigate("signin")}>
                    Sign In
                  </MenuItem>
                  <MenuItem onClick={() => navigate("signup")}>
                    Sign Up
                  </MenuItem>
                  <MenuItem onClick={handleClose}>About</MenuItem>
                  <MenuItem onClick={handleClose}>Dengue Info</MenuItem>
                  <MenuItem onClick={handleClose}>Contact</MenuItem>
                </div>
              )}
            </Menu>
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
