import React from "react";
import { Route, Routes } from "react-router-dom";
import BillPage from "../pages/user/bill/bill-page";
import ListBillPage from "../pages/user/list-bill/list-bill-page";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<ListBillPage />}></Route>
      <Route path="/bill">
        <Route index element={<ListBillPage />}></Route>
        <Route path=":id">
          <Route index element={<BillPage />}></Route>
          <Route path="users" element={<></>}></Route>
          <Route path="setting" element={<></>}></Route>
        </Route>
      </Route>
      {/* <Route index element={<BillPage />}></Route> */}
    </Routes>
  );
};

export default UserRoutes;
