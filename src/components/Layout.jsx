import React from "react";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
// eslint-disable-next-line import/no-cycle
import Header from "./Header";

function Layout() {
  return (
    <Container style={{ margin: 0, padding: 0 }} maxWidth={false}>
      <Header />
      <Outlet />
    </Container>
  );
}

export default Layout;
