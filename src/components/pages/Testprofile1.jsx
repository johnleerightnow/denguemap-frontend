import React, { useContext, useEffect } from "react";
import { LoginContext } from "../../App";

const TestProfile1 = () => {
  const [loggedIn, setloggedIn] = useContext(LoginContext);
  const logout = () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setloggedIn(false);
  };
  useEffect(() => {
    console.log("loggedIn", loggedIn);
  });
  if (loggedIn) {
    return (
      <>
        <h1>Test Profile 1 - Logged In</h1>
        <button onClick={logout}>Logout</button>
      </>
    );
  } else if (!loggedIn) {
    return (
      <>
        <h1>Test Profile 1 - Logged Out</h1>
        <button onClick={logout}>Logout</button>
      </>
    );
  }
};

export default TestProfile1;
