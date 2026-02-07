import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/homePage.jsx";
import Login from "../pages/Login/Login";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
