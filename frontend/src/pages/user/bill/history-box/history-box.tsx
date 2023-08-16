import React, { useContext, useEffect, useState } from "react";
import Box from "../../../../components/box/box";
import PaymentButton from "./payment-button";
import BillApi from "../bill-api";
import { PaymentHistoryData } from "../../../../utils/models/bill/payment-data";
import DateFormatter from "../../../../utils/date-formatter";
import InputText from "../../../../components/input-text/input-text";
import { BsFilterSquare } from "react-icons/bs";
import Checkbox, {
  CheckboxOption,
} from "../../../../components/checkbox/checkbox";
import { BillsCacheContext } from "../../../../contexts/bills-cache-context";
import { UserData } from "../../../../utils/models/user/user-data";
import { Color } from "../../../../components/button/button";
import deepCopy from "../../../../utils/deep-copy";
const HistoryBox = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryData[]>(
    [],
  );

  const [filteredHistory, setFilteredHistory] = useState<PaymentHistoryData[]>(
    [],
  );

  const [openID, setOpenID] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [usersCheckboxList, setUsersCheckboxList] = useState<CheckboxOption[]>(
    [],
  );
  const [selectedCreators, setSelectedCreators] = useState<CheckboxOption[]>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<CheckboxOption[]>([]);
  const { getUsersInBill } = useContext(BillsCacheContext)!;

  const renderDateSeparator = (date: Date) => {
    return (
      <div className="bg-slate-100 p-1 mx-3 rounded-xl shadow w-[100px] text-center font-semibold">
        {new DateFormatter(date).ddMMyyy()}
      </div>
    );
  };

  const renderPaymentHistory = () => {
    return filteredHistory.map((item, index) => {
      if (item.payment.length === 0) return <div key={index}></div>;
      return (
        <div key={index}>
          {renderDateSeparator(item.date)}
          <div>
            {item.payment.map((paymentItem, paymentIndex) => {
              return (
                <div key={paymentIndex} className="flex flex-col">
                  <div className="mt-3">
                    <PaymentButton
                      data={paymentItem}
                      isOpen={paymentItem.id === openID}
                      onClick={() =>
                        setOpenID(
                          paymentItem.id !== openID ? paymentItem.id : "",
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const renderFilerButton = () => {
    return (
      <div
        className="w-[50px] text-3xl text-slate-700 h-[50px] absolute right-5 top-3.5 cursor-pointer"
        onClick={() => setFilterOpen(!filterOpen)}
      >
        <BsFilterSquare />
      </div>
    );
  };

  const renderFilterPanel = () => {
    return (
      <div
        className="duration-300"
        style={{
          maxHeight: `${filterOpen ? 500 : 0}px`,
          opacity: `${filterOpen ? 100 : 0}`,
        }}
      >
        <div className="py-5">
          <div className="flex justify-center flex-col items-center">
            <InputText
              label="Szukaj"
              className="w-3/4"
              value={searchText}
              onChange={(val) => setSearchText(val)}
            />
            <div className="flex flex-row w-3/4 justify-between my-3">
              <Checkbox
                title="Przypisani użytkownicy"
                options={usersCheckboxList}
                value={selectedUsers}
                onChange={(val) => {
                  setSelectedUsers(val);
                }}
              />

              <Checkbox
                title="Utworzone przez"
                options={usersCheckboxList}
                color={Color.PURPLE}
                value={selectedCreators}
                onChange={(val) => {
                  setSelectedCreators(val);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let newHistory: PaymentHistoryData[] = deepCopy(paymentHistory);

    for (const item of newHistory) {
      item.payment = item.payment.filter((day) => {
        for (let creator of selectedCreators) {
          if (day.creatorID === creator.value) {
            return true;
          }
        }
        return false;
      });
    }

    for (const item of newHistory) {
      item.payment = item.payment.filter((day) => {
        for (let selectedUser of selectedUsers) {
          for (let user of day.usersID) {
            if (selectedUser.value === user) {
              return true;
            }
          }
        }
        return false;
      });
    }

    for (const item of newHistory) {
      item.payment = item.payment.filter((day) =>
        day.description
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase()),
      );
    }

    setFilteredHistory(newHistory);
  }, [paymentHistory, searchText, selectedCreators, selectedUsers]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsersInBill("1");

      if (data) setUsersList([...data]);
    };

    fetchUsers();
  }, [getUsersInBill]);

  useEffect(() => {
    if (!usersList) return;

    const newCheckboxList: CheckboxOption[] = [];

    for (const item of usersList) {
      newCheckboxList.push({
        label: item.username,
        value: item.id,
      });
    }

    setUsersCheckboxList([...newCheckboxList]);
    setSelectedCreators([...newCheckboxList]);
    setSelectedUsers([...newCheckboxList]);
  }, [usersList]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await BillApi.getBillHistory("1");

      if (data) setPaymentHistory([...data]);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <Box className="w-full relative" title="Historia">
        {renderFilerButton()}
        {renderFilterPanel()}
        <div className="flex flex-col gap-3 pb-3 max-h-[calc(100vh-170px)] sm:max-h-[calc(100vh-250px)] overflow-auto">
          {renderPaymentHistory()}
        </div>
      </Box>
    </div>
  );
};

export default HistoryBox;
