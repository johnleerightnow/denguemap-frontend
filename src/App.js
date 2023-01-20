import Home from "./components/pages/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
// import HomeTwo from "./components/pages/HomeTwo";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </div>
  );
}

export default App;
