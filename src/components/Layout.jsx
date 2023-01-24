import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth={false}>
        <Header />
        <Outlet />
        <Box sx={{ bgcolor: "#cfe8fc", height: "10vh", width: "90vw" }} />
      </Container>
    </React.Fragment>
  );
};

export default Layout;
