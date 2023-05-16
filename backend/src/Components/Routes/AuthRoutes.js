import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import Login from "../Auth/Login/Login";

export default function AuthRoutes() {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element = {<Login />}></Route>
        </Routes>
    </Router>
    </>
  );
}







