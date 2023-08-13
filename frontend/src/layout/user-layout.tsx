import React from "react";
import UserRoute from "../routes/user-routes";
import Navbar, { NavbarCategory } from "../components/navbar/navbar";
// import Sidebar from "../components/sidebar/sidebar";

const userButtons: NavbarCategory[] = [
  {
    buttons: [
      {
        text: "Rachunki",
        to: "#",
        index: 0,
        active: false,
      },
    ],
  },
  {
    buttons: [
      {
        text: "Podgląd",
        to: "#",
        index: 1,
        active: true,
      },
      {
        text: "Użytkownicy",
        to: "#",
        index: 2,
        active: false,
      },
      {
        text: "Ustawienia",
        to: "#",
        index: 3,
        active: false,
      },
    ],
  },
];

const UserLayout = () => {
  return (
    <div className="relative">
      <div className="absolute w-full">
        <Navbar category={userButtons} />
      </div>
      {/* <Sidebar /> */}
      <div className="lg:pt-[70px] pt-[50px]">
        <UserRoute />
      </div>
    </div>
  );
};

export default UserLayout;
