import React from "react";
import Button, { Color } from "../button/button";
import { BiPlusCircle } from "react-icons/bi";

const Navbar = () => {
  return (
    <div className="h-[70px] border-b shadow">
      <div className="h-full flex flex-row justify-between">
        <div className="flex justify-center items-center w-[200px] h-full text-xl font-poppins">
          GroupShareBills
        </div>

        <div className="flex justify-center items-center mr-5">
          <Button
            text="Nowy rachunek"
            className=""
            color={Color.BLUE}
            enabled={true}
            leftIcon={<BiPlusCircle />}
            onClick={() => console.log(1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
