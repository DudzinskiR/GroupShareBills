import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const UserMenu = () => {
  return (
    <div className="flex flex-row items-center gap-2 cursor-pointer select-none">
      <div className="text-3xl text-gray-600">
        <AiOutlineUser />
      </div>
      <div className="text-gray-600 text-sm w-[180px] truncate">
        Robert Dudziński
      </div>
      <MdOutlineKeyboardArrowDown />
    </div>
  );
};

export default UserMenu;
