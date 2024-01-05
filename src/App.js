import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./Components/Signin";
import SignUp from "./Components/Signup";
import Homepage from "./Components/Homepage";
import Myrecipes from "./Components/Myrecipes";
import Forgotpassword from "./Components/Forgotpassword";
import Otp from "./Components/Otp";
import Profile from "./Components/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn></SignIn>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/homepage" element={<Homepage></Homepage>}></Route>
        <Route path="/myrecipes" element={<Myrecipes></Myrecipes>}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route
          path="/forgotpassword"
          element={<Forgotpassword></Forgotpassword>}
        ></Route>
        <Route path="/otp" element={<Otp></Otp>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
