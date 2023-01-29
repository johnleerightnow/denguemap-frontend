import React, { useState, createContext } from "react";
import Home from "./components/pages/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import { Routes, Route } from "react-router-dom";
import NoMatch from "./components/pages/NoMatch";
import TestProfile1 from "./components/pages/Testprofile1";
import TestProfile2 from "./components/pages/TestProfile2";
import Profile from "./components/pages/Profile";
import { authenticate } from "./components/helpers/utility";
import HomeTwo from "./components/pages/HomeTwo";
import Layout from "./components/Layout";

export const LoginContext = createContext();

function App(props) {
  const [loggedIn, setLoggedIn] = useState(authenticate());
  return (
    <div className="App">
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/testprofile1" element={<TestProfile1 />}></Route>
            <Route path="/testprofile2" element={<TestProfile2 />}></Route>
          </Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="*" element={<NoMatch />}></Route>
        </Routes>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
