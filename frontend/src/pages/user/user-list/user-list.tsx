import React, { useContext, useEffect, useState } from "react";
import Box from "../../../components/box/box";
import { BillsCacheContext } from "../../../contexts/bills-cache-context";
import { UserData } from "../../../utils/models/user/user-data";
import { useParams } from "react-router-dom";
import shortenNumber from "../../../utils/other/shortenNumber";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiZzzFill } from "react-icons/ri";
import Button, { Color } from "../../../components/button/button";
import { UserCacheContext } from "../../../contexts/user-context";
import { UIContext } from "../../../contexts/ui-context";
import BillApi from "../../../utils/api/bill/bill-api";

const UserListPage = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [currency, setCurrency] = useState("");
  const [openID, setOpenID] = useState("");
  const { getUsersInBill, getCurrencyInBill, setUserActive } =
    useContext(BillsCacheContext)!;
  const { userIsAdmin, disableAdminInBill } = useContext(UserCacheContext)!;
  const { openConfirmBox } = useContext(UIContext)!;
  const { id } = useParams();

  const renderUserBox = (user: UserData) => {
    return (
      <div
        className="w-11/12 bg-slate-100 duration-300 rounded-b-lg overflow-hidden"
        style={{
          maxHeight: `${openID === user.id ? 999 : 0}px`,
          opacity: `${openID === user.id ? 100 : 0}`,
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
                    () => setUserActiveHandler(user.id, !user.active),
                  );
                }}
              />
              <Button
                text="Usuń z rachunku"
                color={Color.RED}
                onClick={() => {
                  openConfirmBox(
                    `Czy na pewno chcesz usunąć z rachunku tego użytkownika?`,
                    () => deleteUserFromBill(user.id),
                  );
                }}
              />
              <Button
                text="Ustaw jako zarządca"
                color={Color.PURPLE}
                onClick={() => {
                  openConfirmBox(
                    `Czy na pewno chcesz żeby ten użytkownik zarządzał rachunkiem?`,
                    () => setUserAsAdmin(user.id),
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
      <div key={user.id}>
        <div
          className={`${
            openID === user.id
              ? "bg-slate-200"
              : "bg-slate-50 hover:bg-slate-100"
          } flex flex-row items-center h-10 w-full overflow-hidden rounded-xl text-lg font-montserrat px-3 z-1 relative justify-between shadow cursor-pointer`}
          onClick={() => onClickHandler(user.id)}
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
                openID === user.id ? <IoIosArrowUp /> : <IoIosArrowDown />
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
    BillApi.deleteUserFromBill(userID, id!).then(() => {}); //TODO Dodać obsługę usunięcia użytkownika z rachunku
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

  return (
    <div className="flex justify-center py-5">
      <Box
        title="Lista użytkowników"
        className="w-11/12 md:w-[640px] duration-150"
      >
        <div></div>
        <div>{renderUserList()}</div>
      </Box>
    </div>
  );
};

export default UserListPage;
