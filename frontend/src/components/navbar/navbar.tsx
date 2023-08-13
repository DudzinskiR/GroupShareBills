import React from "react";
import Button from "../button/button";
import { BiPlusCircle } from "react-icons/bi";
import UserMenu from "./user-menu/user-menu";

interface props {
  category?: NavbarCategory[];
}

export interface NavbarCategory {
  buttons: NavbarButton[];
}

export interface NavbarButton {
  text: string;
  to: string;
  index: number;
  active?: boolean;
}

const Navbar = ({ category }: props) => {
  const renderButton = (item: NavbarButton, index: number) => {
    return (
      <div
        key={index}
        className={`min-w-[100px] flex justify-center items-center border-indigo-500 cursor-pointer duration-150
        ${
          item.active
            ? "border-b-2 font-semibold hover:text-indigo-500"
            : "hover:text-indigo-900"
        }
        `}
      >
        {item.text}
      </div>
    );
  };

  const renderButtonsList = () => {
    return (
      <div className="flex flex-row h-full">
        {category?.map((categoryItem, categoryIndex) => {
          return (
            <div key={categoryIndex} className="flex flex-row">
              {categoryIndex !== 0 && (
                <div className="h-full flex items-center mx-1">
                  <div className="h-2/4 border "></div>
                </div>
              )}
              {categoryItem.buttons.map((item, index) => {
                return renderButton(item, index);
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <nav className="lg:h-[70px] h-[50px] border-b shadow bg-slate-950 lg:bg-white duration-150 w-full fixed z-50">
      <div className="h-full flex flex-row lg:justify-between justify-center max-w-[1280px] items-center m-auto">
        <div className="flex flex-row h-full">
          <button className="flex justify-center items-center w-[175px] h-full md:text-xl text-lg font-poppins text-white lg:text-slate-950 duration-150">
            GroupShareBills
          </button>
          <div className="hidden lg:block">{renderButtonsList()}</div>
        </div>
        <div className="flex justify-center items-center mr-5 gap-5">
          <div className="hidden lg:block">
            <Button
              text="Nowy rachunek"
              leftIcon={<BiPlusCircle />}
              onClick={() => console.log(1)}
            />
          </div>
          <UserMenu category={category} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
