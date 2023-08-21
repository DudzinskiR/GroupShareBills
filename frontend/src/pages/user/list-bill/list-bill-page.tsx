import React, { useContext, useEffect, useState } from "react";
import Button from "../../../components/button/button";
import { FaArrowRight } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import BillData from "../../../utils/models/bill/bill-data";
import { useNavigate } from "react-router-dom";
import { UserCacheContext } from "../../../contexts/user-context";
import { BiSolidCrown } from "react-icons/bi";
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
        className=" w-full h-28 bg-white rounded shadow border-2 hover:bg-slate-50 cursor-pointer duration-150 relative"
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

        {data.isAdmin && (
          <div className="absolute top-3 text-yellow-400 right-5 text-3xl">
            <BiSolidCrown />
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchBillData = async () => {
      setBillList(await getBillList());
    };
    fetchBillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-7 pb-5 md:grid-cols-2 py-3 px-3">
      {billList.map((item) => {
        return renderBillButton(item);
      })}
      <div className="cursor-pointer w-full h-28 border-4 rounded-2xl flex justify-center items-center text-xl font-bold text-slate-500 hover:text-slate-600 border-slate-400 hover:border-slate-500 duration-150 border-dashed">
        Dołącz do istniejącego rachunku
      </div>
    </div>
  );
};

export default ListBillPage;
