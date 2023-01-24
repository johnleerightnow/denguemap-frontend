import React from "react";
import { useNavigate } from "react-router-dom";
import { withCookies } from "react-cookie";

const ProtectedRoute = (props) => {
  function isAuthenticated() {
    const token = props.cookies.get("token");

    // checks if token evaluates to false
    if (!token || token === "undefined" || token === "null") {
      return false;
    }

    return true;
  }

  const navigate = useNavigate();

  const Comp = props.component;

  return isAuthenticated() ? <Comp /> : navigate("/login");
};

export default withCookies(ProtectedRoute);
