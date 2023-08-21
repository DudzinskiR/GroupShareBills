import React from "react";
import { Route, Routes } from "react-router-dom";
import BillPage from "../pages/user/bill/bill-page";
import ListBillPage from "../pages/user/list-bill/list-bill-page";
import UserListPage from "../pages/user/user-list/user-list";
import BillSettingPage from "../pages/user/setting/bill-setting";
import UserSettingPage from "../pages/user-setting/user-setting-page";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<ListBillPage />}></Route>
      <Route path="/bill">
        <Route index element={<ListBillPage />}></Route>
        <Route path=":id">
          <Route index element={<BillPage />}></Route>
          <Route path="users" element={<UserListPage />}></Route>
          <Route path="setting" element={<BillSettingPage />}></Route>
        </Route>
      </Route>
      <Route path="/user">
        <Route index element={<UserSettingPage />}></Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
