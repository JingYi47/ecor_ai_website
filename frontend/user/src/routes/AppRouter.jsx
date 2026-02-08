import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/homePage.jsx";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
