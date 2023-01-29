import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import Header from './Header';

function Layout() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false}>
        <Header />
        <Outlet />
        <Box sx={{ bgcolor: '#cfe8fc', height: '10vh', width: '100vw' }} />
      </Container>
    </>
  );
}

export default Layout;
