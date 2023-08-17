import React, { useEffect, useState } from "react";
import Box from "../../../../components/box/box";
import PaymentButton from "./payment-button";
import { PaymentHistoryData } from "../../../../utils/models/bill/payment-data";
import DateFormatter from "../../../../utils/other/date-formatter";
import InputText from "../../../../components/input-text/input-text";
import { BsFilterSquare } from "react-icons/bs";
import Checkbox, {
  CheckboxOption,
} from "../../../../components/checkbox/checkbox";
import { UserData } from "../../../../utils/models/user/user-data";
import { Color } from "../../../../components/button/button";
import deepCopy from "../../../../utils/other/deep-copy";

interface props {
  usersList: UserData[];
  currency: string;
  paymentHistory: PaymentHistoryData[];
}

const HistoryBox = ({ usersList, currency, paymentHistory }: props) => {
  const [filteredHistory, setFilteredHistory] = useState<PaymentHistoryData[]>(
    [],
  );

  const [openID, setOpenID] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [usersCheckboxList, setUsersCheckboxList] = useState<CheckboxOption[]>(
    [],
  );
  const [selectedCreators, setSelectedCreators] = useState<CheckboxOption[]>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<CheckboxOption[]>([]);
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");

  const renderDateSeparator = (date: Date) => {
    return (
      <div className="bg-slate-100 p-1 mx-3 rounded-xl shadow w-[100px] text-center font-semibold">
        {new DateFormatter(date).ddMMyyy()}
      </div>
    );
  };

  const renderPaymentHistory = () => {
    let emptyTab = true;

    for (const item of filteredHistory) {
      if (item.payment.length) {
        emptyTab = false;
        break;
      }
    }

    if (emptyTab) {
      return (
        <div className="flex justify-center items-center h-[200px] text-3xl font-bold text-slate-400">
          Nic tu nie ma :(
        </div>
      );
    }

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
                      currency={currency}
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
            <div className="flex flex-col sm:flex-row w-3/4 justify-between my-3 gap-3">
              <Checkbox
                title="Użytkownicy"
                options={usersCheckboxList}
                value={selectedUsers}
                onChange={(val) => {
                  setSelectedUsers(val);
                }}
                btnClassName="text-sm"
              />

              <Checkbox
                title="Dodane przez"
                options={usersCheckboxList}
                color={Color.PURPLE}
                value={selectedCreators}
                onChange={(val) => {
                  setSelectedCreators(val);
                }}
                btnClassName="text-sm "
              />
            </div>

            <div className="flex flex-row w-3/4 justify-between">
              <div className="flex justify-center items-center text-lg">
                Kwota:
              </div>
              <InputText
                label="Od"
                className="w-[100px]"
                type="number"
                value={amountFrom}
                onChange={(val) => setAmountFrom(val)}
              />
              <InputText
                label="Do"
                className="w-[100px]"
                type="number"
                value={amountTo}
                onChange={(val) => setAmountTo(val)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!paymentHistory) return;

    let newHistory: PaymentHistoryData[] = deepCopy(paymentHistory);

    if (selectedCreators.length !== usersCheckboxList.length) {
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
    }

    if (selectedCreators.length !== usersCheckboxList.length) {
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
    }

    if (searchText !== "") {
      for (const item of newHistory) {
        item.payment = item.payment.filter((day) =>
          day.description
            .toLocaleLowerCase()
            .includes(searchText.toLocaleLowerCase()),
        );
      }
    }

    if (Number(amountTo) > 0) {
      for (const item of newHistory) {
        item.payment = item.payment.filter((day) => {
          return day.value > Number(amountFrom) && day.value < Number(amountTo);
        });
      }
    }

    setFilteredHistory(newHistory);
  }, [
    paymentHistory,
    searchText,
    selectedCreators,
    selectedUsers,
    amountFrom,
    amountTo,
    usersCheckboxList.length,
  ]);

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
