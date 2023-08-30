import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiZzzFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

import { useParams } from "react-router-dom";

import Box from "../../../components/box/box";
import Button, { Color } from "../../../components/button/button";
import Username from "../../../components/username/username";
import { BillsCacheContext } from "../../../contexts/bills-cache-context";
import { UIContext } from "../../../contexts/ui-context";
import { UserCacheContext } from "../../../contexts/user-context";
import BillApi from "../../../utils/api/bill/bill-api";
import { UserData } from "../../../utils/models/user/user-data";
import shortenNumber from "../../../utils/other/shortenNumber";

const UserListPage = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [currency, setCurrency] = useState("");
  const [openID, setOpenID] = useState("");
  const [clickText, setClickText] = useState("Naciśnij żeby skopiować");

  const [userRequestList, setUserRequestList] = useState<string[]>([]);
  const { getUsersInBill, getCurrencyInBill, setUserActive } =
    useContext(BillsCacheContext)!;
  const { userIsAdmin, disableAdminInBill } = useContext(UserCacheContext)!;
  const { openConfirmBox } = useContext(UIContext)!;
  const { id } = useParams();

  const renderRequestBox = () => {
    return (
      <div className="flex flex-col justify-center items-center gap-3 py-2">
        <div className="text-2xl">Link z zaproszeniem</div>
        <div
          className="border bg-slate-100 p-3 rounded-lg cursor-pointer"
          onClick={() => {
            setClickText("Skopiowano");
            navigator.clipboard.writeText(
              `${window.location.origin}/invite/${id!}`,
            );
          }}
        >
          <div>
            {window.location.origin}/invite/{id!}
          </div>
          <div className="text-center mt-2">{clickText}</div>
        </div>
        {userRequestList.map((item, index) => {
          return (
            <div
              key={index}
              className="w-11/12 bg-slate-50 duration-300 rounded-b-lg flex flex-row items-center h-10 rounded-xl text-lg font-montserrat px-3 z-1 relative justify-between shadow"
            >
              <div>
                <Username id={item} className="" />
              </div>
              <div className=" flex flex-row items-center gap-3">
                <Button
                  rounded
                  color={Color.RED}
                  centerIcon={<AiFillDelete />}
                  className="text-white w-[30px] h-[30px]"
                  onClick={() => {
                    openConfirmBox(
                      `Czy na pewno chcesz odrzucić to podanie?`,
                      () => {
                        removeRequestHandler(item);
                      },
                    );
                  }}
                />
                <Button
                  rounded
                  centerIcon={<AiOutlinePlus />}
                  className="text-white w-[30px] h-[30px]"
                  color={Color.GREEN}
                  onClick={() => {
                    openConfirmBox(
                      `Czy na pewno chcesz potwierdzić to podanie?`,
                      () => {
                        acceptHandler(item);
                      },
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const acceptHandler = (userID: string) => {
    BillApi.acceptRequest(id!, userID);
  };

  const removeRequestHandler = (userID: string) => {
    BillApi.removeRequest(id!, userID);
  };

  const renderUserBox = (user: UserData) => {
    return (
      <div
        className="w-11/12 bg-slate-100 duration-300 rounded-b-lg overflow-hidden"
        style={{
          maxHeight: `${openID === user.userID ? 999 : 0}px`,
          opacity: `${openID === user.userID ? 100 : 0}`,
        }}
      >
        <div className="p-3 flex flex-row justify-around">
          <div className="w-8/12">
            <div className="font-semibold text-slate-800 text-sm">
              Nazwa Użytkownika
            </div>
            <div className="text-xl break-words">{user.username}</div>
          </div>

          <div>
            <div className="font-semibold text-slate-800 text-sm">
              Wpłacone środki
            </div>
            <div className="text-xl">
              {user.amountPaid}
              {currency}
            </div>
          </div>
        </div>

        {userIsAdmin(id!) && (
          <div className="flex justify-center mb-3">
            <div className="grid w-3/4 grid-cols-3 gap-5 text-sm">
              <Button
                text={`Ustaw jako ${user.active ? "nieaktywny" : "aktywny"}`}
                onClick={() => {
                  openConfirmBox(
                    `Czy na pewno chcesz ustawić tego użytkownika jako ${
                      user.active ? "nieaktywny" : "aktywny"
                    }?`,
                    () => setUserActiveHandler(user.userID, !user.active),
                  );
                }}
              />
              <Button
                text="Usuń z rachunku"
                color={Color.RED}
                onClick={() => {
                  openConfirmBox(
                    `Czy na pewno chcesz usunąć z rachunku tego użytkownika?`,
                    () => deleteUserFromBill(user.userID),
                  );
                }}
              />
              <Button
                text="Ustaw jako zarządca"
                color={Color.PURPLE}
                onClick={() => {
                  openConfirmBox(
                    `Czy na pewno chcesz żeby ten użytkownik zarządzał rachunkiem?`,
                    () => setUserAsAdmin(user.userID),
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUser = (user: UserData) => {
    return (
      <div key={user.userID}>
        <div
          className={`${
            openID === user.userID
              ? "bg-slate-200"
              : "bg-slate-50 hover:bg-slate-100"
          } flex flex-row items-center h-10 w-full overflow-hidden rounded-xl text-lg font-montserrat px-3 z-1 relative justify-between shadow cursor-pointer`}
          onClick={() => onClickHandler(user.userID)}
        >
          <div className="flex flex-row items-center w-full">
            {!user.active ? <RiZzzFill className="text-xl" /> : <></>}
            <div className="w-full table table-fixed">
              <div className="table-cell truncate">{user.username}</div>
            </div>
          </div>

          <div className="flex flex-row">
            <div>
              {shortenNumber(user.amountPaid || 0)}
              {currency}
            </div>
            <Button
              rounded
              centerIcon={
                openID === user.userID ? <IoIosArrowUp /> : <IoIosArrowDown />
              }
              className="w-[30px] h-[30px] ml-5"
            />
          </div>
        </div>
        <div className="w-full flex justify-center">{renderUserBox(user)}</div>
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div className="flex flex-col p-3 gap-3">
        {userList.map((item, index) => {
          return renderUser(item);
        })}
      </div>
    );
  };

  const onClickHandler = (id: string) => {
    if (openID !== id) {
      setOpenID(id);
    } else {
      setOpenID("");
    }
  };

  const setUserActiveHandler = (userID: string, isActive: boolean) => {
    BillApi.setUserActive(userID, id!, isActive).then(() => {
      setUserActive(userID, id!, isActive);
    });
  };

  const setUserAsAdmin = (userID: string) => {
    BillApi.setUserAsAdmin(userID, id!).then(() => {
      disableAdminInBill(id!);
    });
  };

  const deleteUserFromBill = (userID: string) => {
    BillApi.deleteUserFromBill(userID, id!).then(() => {});
  };

  useEffect(() => {
    getUsersInBill(id!).then((val) => {
      setUserList(val || []);
    });
  }, [getUsersInBill, id]);

  useEffect(() => {
    getCurrencyInBill(id!).then((val) => {
      setCurrency(val);
    });
  }, [getCurrencyInBill, id]);

  useEffect(() => {
    BillApi.getRequestList(id!).then((val) => {
      setUserRequestList(val);
    });
  }, [id]);

  return (
    <div
      className={`${
        userIsAdmin(id!)
          ? "w-full flex lg:flex-row flex-col gap-5 p-5"
          : "flex justify-center py-5"
      }`}
    >
      <Box
        title="Lista użytkowników"
        className="w-11/12 md:w-[640px] duration-150"
      >
        <div></div>
        <div>{renderUserList()}</div>
      </Box>

      {userIsAdmin(id!) && (
        <Box
          title="Wnioski o dołączenie"
          className="w-11/12 md:w-[640px] duration-150 h-min"
        >
          <div>{renderRequestBox()}</div>
        </Box>
      )}
    </div>
  );
};

export default UserListPage;
