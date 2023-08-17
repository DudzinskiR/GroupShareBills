import React, { useContext, useEffect, useState } from "react";
import Button from "../../../components/button/button";
import { FaArrowRight } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import BillData from "../../../utils/models/bill/bill-data";
import { useNavigate } from "react-router-dom";
import { UserCacheContext } from "../../../contexts/user-context";

const ListBillPage = () => {
  const [billList, setBillList] = useState<BillData[]>([]);

  const navigate = useNavigate();

  const { getBillList } = useContext(UserCacheContext)!;

  const onClickHandler = (id: string) => {
    navigate(`/bill/${id}`);
  };

  const renderBillButton = (data: BillData) => {
    return (
      <div
        key={data.id}
        className=" w-full h-28 bg-white rounded shadow border-2 hover:bg-slate-50 cursor-pointer duration-150"
        onClick={() => onClickHandler(data.id)}
      >
        <div className="w-full flex justify-center text-lg sm:text-xl md:text-2xl truncate mt-3">
          {data.name.slice(0, 32)}
        </div>

        <div className="flex flex-row justify-around mt-2">
          <div className="flex flex-row items-center text-2xl">
            <GoPeople className="mr-3" /> x{data.userNumber}
          </div>
          <Button rounded className="w-12 h-12" centerIcon={<FaArrowRight />} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchBillData = async () => {
      setBillList(await getBillList());
    };
    fetchBillData();
  }, [getBillList]);

  return (
    <div className="grid grid-cols-1 gap-7 pb-5 md:grid-cols-2 py-3 px-3">
      {billList.map((item) => {
        return renderBillButton(item);
      })}
    </div>
  );
};

export default ListBillPage;
