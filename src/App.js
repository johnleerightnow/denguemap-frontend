import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import NoMatch from "./components/pages/NoMatch";
import TestProfile1 from "./components/pages/Testprofile1";
import TestProfile2 from "./components/pages/TestProfile2";
import Profile from "./components/pages/Profile";
import { authenticate } from "./components/helpers/utility";
import Layout from "./components/Layout";
import ContactForm from "./components/pages/ContactForm.jsx";

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
            <Route path='/testprofile1' element={<TestProfile1 />} />
            <Route path='/testprofile2' element={<TestProfile2 />} />
            <Route path='/contactform' element={<ContactForm />} />
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
