import React, { useContext, useEffect, useState } from "react";
import Box from "../../../components/box/box";
import InputText from "../../../components/input-text/input-text";
import Button, { Color } from "../../../components/button/button";
import { UserCacheContext } from "../../../contexts/user-context";
import { useNavigate, useParams } from "react-router-dom";
import { UIContext } from "../../../contexts/ui-context";
import BillApi from "../../../utils/api/bill/bill-api";

const BillSettingPage = () => {
  const [billName, setBillName] = useState("");

  const { getBillList, userIsAdmin, removeBillFromList } =
    useContext(UserCacheContext)!;
  const { openConfirmBox } = useContext(UIContext)!;

  const navigate = useNavigate();

  const { id } = useParams();

  const renderAdminView = () => {
    return (
      <div className="p-3 flex flex-col gap-3">
        <InputText
          label="Nazwa rachunku"
          value={billName}
          onChange={(val) => setBillName(val)}
        />

        <div className="flex flex-row w-full justify-around">
          <Button
            text="Zapisz"
            className="w-32"
            color={Color.PURPLE}
            onClick={() =>
              openConfirmBox(
                "Czy na pewno chcesz zapisać zmiany?",
                saveBillCallback,
              )
            }
          />
        </div>

        <div className="w-full border mt-10"></div>

        <div className="flex flex-row justify-around">
          <Button
            text="Zamknij rachunek"
            color={Color.RED}
            onClick={() =>
              openConfirmBox(
                "Czy na pewno chcesz zamknąć rachunek? Nie będzie już powrotu",
                closeBillCallback,
              )
            }
          />
          <Button
            text="Opuść rachunek"
            color={Color.RED}
            onClick={() =>
              openConfirmBox(
                "Czy na pewno chcesz opuścić ten rachunek?",
                leaveBillCallback,
              )
            }
          />
        </div>
      </div>
    );
  };

  const renderUserView = () => {
    return (
      <div className="p-3 flex flex-col gap-3">
        <Button
          text="Opuść rachunek"
          color={Color.RED}
          onClick={() =>
            openConfirmBox(
              "Czy na pewno chcesz opuścić ten rachunek?",
              leaveBillCallback,
            )
          }
        />
      </div>
    );
  };

  const saveBillCallback = () => {
    BillApi.updateBillSetting(id!, billName).then(() => {});
  };

  const closeBillCallback = () => {
    BillApi.closeBill(id!).then(() => {
      removeBillFromList(id!);
      navigate("/");
    });
  };

  const leaveBillCallback = () => {
    BillApi.leaveBill(id!).then(() => {
      removeBillFromList(id!);
      navigate("/");
    });
  };

  useEffect(() => {
    getBillList().then((val) => {
      const name = val.find((item) => item.id === id!)?.name;

      setBillName(`${name}`);
    });
  }, [getBillList, id]);

  return (
    <div className="flex justify-center py-5">
      <Box
        title="Ustawienia rachunku"
        className="w-11/12 md:w-[640px] duration-150"
      >
        {userIsAdmin(id!) ? renderAdminView() : renderUserView()}
      </Box>
    </div>
  );
};

export default BillSettingPage;
