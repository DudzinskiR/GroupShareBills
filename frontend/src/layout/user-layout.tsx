import React, { useContext, useEffect } from "react";
import UserRoute from "../routes/user-routes";
import Navbar, { NavbarCategory } from "../components/navbar/navbar";
import { useLocation } from "react-router-dom";
import NewBillBox from "../components/new-bill-box/new-bill-box";
import ConfirmBox from "../components/confirm-box/confirm-box";
import { UserCacheContext } from "../contexts/user-context";

const UserLayout = () => {
  const location = useLocation();

  const userButtons: NavbarCategory[] = [
    {
      buttons: [
        {
          text: "Rachunki",
          to: "/",
          index: 0,
          active: false,
        },
      ],
    },
    {
      buttons: [
        {
          text: "Podgląd",
          to: `/bill/${location.pathname.split("/")[2]}`,
          index: 1,
          active: location.pathname.split("/").length === 3,
        },
        {
          text: "Użytkownicy",
          to: `/bill/${location.pathname.split("/")[2]}/users`,
          index: 2,
          active: location.pathname.split("/")[3] === "users",
        },
        {
          text: "Ustawienia",
          to: `/bill/${location.pathname.split("/")[2]}/setting`,
          index: 3,
          active: location.pathname.split("/")[3] === "setting",
        },
      ],
    },
  ];

  const { getBillList } = useContext(UserCacheContext)!;

  useEffect(() => {
    getBillList();
  }, [getBillList]);

  return (
    <div className="relative flex justify-center">
      <div className="absolute w-full">
        <Navbar
          category={location.pathname.split("/").length < 3 ? [] : userButtons}
        />
        a<br />
      </div>
      <div className="lg:pt-[70px] pt-[50px] w-max-[1280px] w-[1280px]">
        <UserRoute />
      </div>
      <NewBillBox />
      <ConfirmBox />
    </div>
  );
};

export default UserLayout;
