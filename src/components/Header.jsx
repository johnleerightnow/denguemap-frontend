import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { LoginContext } from '../App';
import { menuItems } from './constants';

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    handleClose();
    setLoggedIn(false);
  };

  const handleMenuItemClick = (item) => {
    const {
      key,
      navigateTo,
    } = item;
    handleClose();
    switch (key) {
      case 'logOut':
        logOut();
        break;
      default:
        break;
    }
    if (navigateTo) navigate(navigateTo);
  };

  const renderMenuItem = (item) => {
    const {
      label,
      key,
      secureLink,
      guestOnly,
    } = item;

    // Guest items should be have loggedIn as true
    if (guestOnly && !loggedIn) {
      return (
        <MenuItem key={key} onClick={() => handleMenuItemClick(item)}>
          {label}
        </MenuItem>
      );
    }

    // Secure link then should be logged in
    if (secureLink && loggedIn) {
      return (
        <MenuItem key={key} onClick={() => handleMenuItemClick(item)}>
          {label}
        </MenuItem>
      );
    }

    // No need to check session in case if not a secure link, just check if it is not guestOnly
    if (!secureLink && !guestOnly) {
      return (
        <MenuItem key={key} onClick={() => handleMenuItemClick(item)}>
          {label}
        </MenuItem>
      );
    }
    return (
      null
    );
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100vw' }}>
      <AppBar style={{ background: '#2E3B55' }} position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate('/')}
          >
            Dengue Map
          </Typography>
          <>
            <IconButton
              size="large"
              color="inherit"
              aria-controls="menu-appbar"
              aria-label="menu"
              aria-haspopup="true"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <div>
                {menuItems.map((item) => renderMenuItem(item))}
              </div>
            </Menu>
          </>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
