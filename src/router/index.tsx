import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Recruiter from "../pages/Recruiter";

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/recruiter" element={<Recruiter />} />
</Routes>
</BrowserRouter>
);
