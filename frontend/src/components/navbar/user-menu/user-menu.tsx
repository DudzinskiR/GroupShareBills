import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BiPlusCircle } from "react-icons/bi";

import Button, { Color } from "../../button/button";
import { NavbarButton, NavbarCategory } from "../navbar";
import { UserCacheContext } from "../../../contexts/user-context";
import Username from "../../username/username";
import { NavLink } from "react-router-dom";

interface props {
  category?: NavbarCategory[];
}

const UserMenu = ({ category }: props) => {
  const [isOpen, setOpen] = useState(false);
  const { getUserID } = useContext(UserCacheContext)!;
  const menuSmallRef = useRef(null);
  const menuBigRef = useRef(null);
  const [username, setUsername] = useState("");

  const logout = () => {
    console.log("Wylogowanie");
  };

  useEffect(() => {
    const fetchUsername = async () => {
      setUsername(await getUserID());
    };

    fetchUsername();
  }, [getUserID]);

  const renderSmallMenuButton = (
    text?: string,
    onClick?: () => void,
    icon?: ReactElement,
  ) => {
    return (
      <div
        className="h-[30px] flex items-center flex-row gap-2 text-md bg-slate-700  rounded-lg hover:bg-slate-600  px-2 py-5 duration-150 cursor-pointer"
        onClick={onClick}
      >
        <div className="text-xl text-white">{icon}</div>
        <div className="text-white font-semibold text-sm flex flex-row items-center">
          {text}
        </div>
      </div>
    );
  };

  const renderSmallMenu = () => {
    return (
      <div className="absolute top-[25px]">
        <div className="bg-slate-800  w-[200px] p-2 rounded-lg border shadow flex flex-col gap-2 ">
          {renderSmallMenuButton("Konto", () => {}, <AiOutlineUser />)}
          {renderSmallMenuButton("Wyloguj", logout, <BiLogOut />)}
        </div>
      </div>
    );
  };

  const renderBigMenuButton = (item: NavbarButton) => {
    return (
      <NavLink
        to={item.to}
        key={item.index}
        className="h-[50px] flex items-center bg-slate-700 hover:bg-slate-600 rounded-lg w-full mb-3 duration-150"
      >
        <div className="text-white font-semibold text-sm flex flex-row items-center">
          {item.active && (
            <div className="bg-sky-400 w-[10px] h-[50px] rounded-l absolute"></div>
          )}
          <div className="ml-[55px]">{item.text}</div>
        </div>
      </NavLink>
    );
  };

  const renderBigMenu = () => {
    return (
      <div
        className="w-[90vw] bg-slate-800 flex rounded-lg p-4 flex-col"
        ref={menuBigRef}
      >
        <div className="h-[50px] flex items-center bg-slate-700 rounded-lg w-full hover:bg-slate-600">
          <div className="text-white font-semibold flex flex-row items-center pl-3 justify-between w-full">
            <div className="flex flex-row items-center">
              <div className="text-3xl">
                <AiOutlineUser />
              </div>
              <div className={`text-sm ml-3 truncate w-[175px]`}>
                <div className="truncate">
                  <Username id={username} />
                </div>
              </div>
            </div>
            <div className="mr-5">
              <AiOutlineArrowRight />
            </div>
          </div>
        </div>

        <Button
          text="Nowy rachunek"
          leftIcon={<BiPlusCircle />}
          onClick={() => console.log(1)} //TODO obsługa nowego rachunka
          className="my-3 h-[50px]"
        />

        {category?.map((categoryItem, categoryIndex) => {
          return (
            <div key={categoryIndex}>
              {categoryIndex !== 0 && (
                <div className="w-full flex items-center justify-center mb-3">
                  <div className="h-[1px] w-10/12 border border-slate-500"></div>
                </div>
              )}
              <div key={categoryIndex}>
                {categoryItem.buttons.map((item, index) => {
                  return renderBigMenuButton(item);
                })}
              </div>
            </div>
          );
        })}

        <Button
          text="Wyloguj"
          color={Color.PURPLE}
          className="mt-5"
          onClick={() => console.log("Wylogowanie")}
        />
      </div>
    );
  };

  const renderMenu = () => {
    return (
      <>
        <div className="hidden lg:block absolute" ref={menuSmallRef}>
          {renderSmallMenu()}
        </div>
        <div className="block lg:hidden absolute translate-x-[-50%] left-[50%] top-[55px] z-[9999]">
          {renderBigMenu()}
        </div>
      </>
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuSmallRef.current &&
        !(menuSmallRef.current as Node).contains(event.target as Node) &&
        menuBigRef.current &&
        !(menuBigRef.current as Node).contains(event.target as Node)
      ) {
        setTimeout(() => {
          setOpen(false);
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div
        className="flex flex-row items-center gap-2 cursor-pointer select-none lg:relative duration-150"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="lg:flex flex-row items-center hidden">
          <div className="text-3xl text-gray-600">
            <AiOutlineUser />
          </div>
          <div className="text-gray-600 text-sm w-[180px] truncate pl-2">
            <Username id={username} />
          </div>
          <MdOutlineKeyboardArrowDown />
        </div>
      </div>

      <div
        className="text-white absolute right-10 md:text-3xl text-2xl cursor-pointer lg:hidden"
        onClick={() => setOpen(!isOpen)}
      >
        <GiHamburgerMenu />
      </div>
      {isOpen && renderMenu()}
    </>
  );
};

export default UserMenu;
