import React, { useContext } from "react";
import { UIContext } from "../../contexts/ui-context";
import Button, { Color } from "../button/button";

const ConfirmBox = () => {
  const { isConfirmOpen, setConfirmOpen, getConfirmCallback, getConfirmText } =
    useContext(UIContext)!;

  return (
    <div
      className="fixed top-0 left-0 z-50 duration-150"
      style={{
        opacity: `${isConfirmOpen() ? "100" : "0"}`,
        pointerEvents: `${isConfirmOpen() ? "auto" : "none"}`,
      }}
    >
      <div
        className="w-full h-full fixed bg-black/50"
        onClick={() => setConfirmOpen(false)}
      ></div>
      <div className="fixed max-w-[600px] z-50 md:w-[500px] sm:w-[400px] w-[300px] rounded-lg top-[calc(50%-100px)] -translate-y-1/2 left-1/2 -translate-x-1/2 bg-slate-800 p-3 text-white shadow-lg border-4 border-slate-900">
        <div className="flex justify-center text-2xl font-bold text-slate-50 mb-5 text-center">
          {getConfirmText()}
        </div>
        <div className="w-full flex flex-row justify-around">
          <Button
            text="Tak"
            className="w-32"
            color={Color.BLUE}
            onClick={getConfirmCallback()}
          />
          <Button
            text="Nie"
            className="w-32"
            color={Color.PURPLE}
            onClick={() => setConfirmOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
