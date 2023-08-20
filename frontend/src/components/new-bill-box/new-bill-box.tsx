import React, { useContext, useState } from "react";
import { UIContext } from "../../contexts/ui-context";
import InputText from "../input-text/input-text";
import Button, { Color } from "../button/button";
import SelectInput from "../select-input/select-input";
import BillApi from "../../utils/api/bill/bill-api";
import { useNavigate } from "react-router-dom";
import { UserCacheContext } from "../../contexts/user-context";
import { currencyOptions } from "../../utils/other/currency-type";

interface InputsValue {
  name: string;
  currency: string;
}

const NewBillBox = () => {
  const { isNewBillOpen, setNewBillOpen } = useContext(UIContext)!;
  const { addNewBill } = useContext(UserCacheContext)!;
  const navigate = useNavigate();

  const [inputData, setInputData] = useState<InputsValue>({
    name: "",
    currency: "",
  });

  const [buttonText, setButtonText] = useState("Utwórz");

  const createNewBill = () => {
    const postData = async () => {
      setButtonText("Ładowanie");
      const data = await BillApi.postNewBill(
        inputData.name,
        inputData.currency,
      );
      setButtonText("Utwórz");
      setNewBillOpen(false);
      addNewBill(data, inputData.name);
      setInputData({ name: "", currency: "" });
      navigate(`/bill/${data}`);
    };

    postData();
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 duration-150"
      style={{
        opacity: `${isNewBillOpen() ? "100" : "0"}`,
        pointerEvents: `${isNewBillOpen() ? "auto" : "none"}`,
      }}
    >
      <div
        className="w-full h-full fixed bg-black/50"
        onClick={() => setNewBillOpen(false)}
      ></div>
      <div className="fixed max-w-[600px] z-50 md:w-[500px] sm:w-[400px] w-[250px] rounded-lg top-[100px] left-1/2 -translate-x-1/2 bg-slate-800 p-3 text-white shadow-lg border-4 border-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full text-center text-2xl font-semibold">
            Nowy rachunek
          </div>

          <InputText
            label="Nazwa"
            className="w-3/4"
            onChange={(val) => {
              setInputData((prev) => ({ ...prev, name: val }));
            }}
            value={inputData.name}
          />

          <SelectInput
            options={[
              {
                label: "-Wybierz-",
                value: "",
              },
              ...currencyOptions,
            ]}
            className="w-3/4"
            onChange={(val) => {
              setInputData((prev) => ({ ...prev, currency: `${val.value}` }));
            }}
            value={{ value: inputData.currency, label: "" }}
            dark
          />

          <Button
            text={buttonText}
            color={Color.GREEN}
            className="w-3/4"
            onClick={createNewBill}
            enabled={
              inputData.name.length >= 3 &&
              buttonText !== "Ładowanie" &&
              inputData.currency !== ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NewBillBox;
