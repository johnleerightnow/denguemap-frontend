import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import NoMatch from "./components/pages/NoMatch";
import Profile from "./components/pages/Profile";
import { authenticate } from "./components/helpers/utility";
import Layout from "./components/Layout";
import ContactForm from "./components/pages/ContactForm.jsx";
import ForgetPassword from "./components/pages/ForgetPassword";
import ResetPassword from "./components/pages/ResetPassword";
import About from "./components/pages/About";
import DengueInfo from "./components/pages/DengueInfo";

export const LoginContext = createContext();

function App(props) {
  const [loggedIn, setLoggedIn] = useState(authenticate());
  return (
    <div className='App'>
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/about' element={<About />} />
            <Route path='/dengueinfo' element={<DengueInfo />} />
            <Route path='/contactform' element={<ContactForm />} />
            <Route path='/forgetpassword' element={<ForgetPassword />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
          </Route>
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<NoMatch />} />
        </Routes>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
