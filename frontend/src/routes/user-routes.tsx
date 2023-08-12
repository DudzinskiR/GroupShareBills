import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/user/home/home";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />}></Route>
    </Routes>
  );
};

export default UserRoutes;
