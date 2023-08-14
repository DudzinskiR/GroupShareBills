import React from "react";
import { Route, Routes } from "react-router-dom";
import BillPage from "../pages/user/bill/bill-page";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<BillPage />}></Route>
    </Routes>
  );
};

export default UserRoutes;
