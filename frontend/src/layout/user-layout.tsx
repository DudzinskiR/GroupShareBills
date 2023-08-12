import React from "react";
import UserRoute from "../routes/user-routes";
import Navbar from "../components/navbar/navbar";
// import Sidebar from "../components/sidebar/sidebar";

const UserLayout = () => {
  return (
    <div>
      <Navbar />
      {/* <Sidebar /> */}
      <UserRoute />
    </div>
  );
};

export default UserLayout;
