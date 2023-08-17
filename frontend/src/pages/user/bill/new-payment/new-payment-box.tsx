import React, { useContext, useEffect, useState } from "react";
import InputText from "../../../../components/input-text/input-text";
import Checkbox, {
  CheckboxOption,
} from "../../../../components/checkbox/checkbox";
import Button, { Color } from "../../../../components/button/button";
import { UserData } from "../../../../utils/models/user/user-data";
import BillApi from "../../../../utils/api/bill/bill-api";
import { BillsCacheContext } from "../../../../contexts/bills-cache-context";
import { useParams } from "react-router-dom";

interface props {
  paymentIsOpen: boolean;
  closeWindow: () => void;
  currency: string;
  usersList: UserData[];
}

const NewPaymentBox = ({
  paymentIsOpen,
  closeWindow,
  currency,
  usersList,
}: props) => {
  const [checkboxOption, setCheckboxOption] = useState<CheckboxOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<CheckboxOption[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const { addPaymentInBill } = useContext(BillsCacheContext)!;
  const { id } = useParams();

  const createNewPayment = () => {
    const postData = async () => {
      const result = await BillApi.postNewPayment(
        description,
        Number(amount),
        selectedUsers,
      );

      if (result) {
        addPaymentInBill(
          id!,
          description,
          Number(amount),
          selectedUsers.map<string>((item) => item.value),
        );
      }
    };

    postData();
  };

  useEffect(() => {
    if (!usersList) return;

    setCheckboxOption(
      usersList.map<CheckboxOption>((item) => {
        return {
          label: item.username,
          value: item.id,
        };
      }),
    );

    const newSelectedUsers: CheckboxOption[] = [];
    for (const item of usersList) {
      if (item.active) {
        newSelectedUsers.push({ label: item.username, value: item.id });
      }
    }

    setSelectedUsers(newSelectedUsers);
  }, [usersList]);

  return (
    <>
      <div
        className="absolute duration-150 z-50"
        style={{
          opacity: `${paymentIsOpen ? "100" : "0"}`,
          pointerEvents: `${paymentIsOpen ? "auto" : "none"}`,
        }}
      >
        <div
          className="w-full h-full fixed top-0 left-0 bg-black/50 "
          onClick={closeWindow}
        ></div>
        <div className="fixed max-w-[600px] md:w-[500px] sm:w-[400px] w-[250px] rounded-lg top-[100px] left-1/2 -translate-x-1/2 bg-slate-800 p-3 text-white shadow-lg border-4 border-slate-900">
          <div className="w-full text-center text-2xl font-semibold">
            Nowa płatność
          </div>
          <InputText
            className="bg-slate-700 focus:bg-slate-700 mt-2 text-white"
            value={description}
            onChange={(val) => setDescription(val)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-3 mt-3">
            <div className="md:mt-2 mt-0 text-center font-semibold">
              Na kwote [{currency}]
            </div>
            <div className="w-full flex justify-center">
              <InputText
                className="bg-slate-700 focus:bg-slate-700 mt-2 text-white w-24"
                type="number"
                value={amount}
                onChange={(val) => setAmount(val)}
              />
            </div>

            <div className="text-center font-semibold">Dla użytkowników</div>
            <div className="md:w-24 w-full flex justify-center md:justify-normal md:block">
              <Checkbox
                title="Wybierz"
                options={checkboxOption}
                onChange={(val) => setSelectedUsers(val)}
                value={selectedUsers}
                withCounter
              />
            </div>

            <div className="flex justify-center mt-3 col-span-1 md:col-span-2">
              <Button
                text="Zapisz"
                className="w-[200px]"
                color={Color.GREEN}
                enabled={selectedUsers.length > 0}
                onClick={createNewPayment}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPaymentBox;
