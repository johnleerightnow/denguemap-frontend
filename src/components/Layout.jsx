import React from "react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <React.Fragment>
      <Container maxWidth={false}>
        <Header />
        <Outlet />
      </Container>
    </React.Fragment>
  );
};

export default Layout;
