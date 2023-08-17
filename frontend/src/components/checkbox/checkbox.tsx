import React, { useEffect, useRef, useState } from "react";
import Button, { Color } from "../button/button";

interface props {
  onChange?: (val: CheckboxOption[]) => void;
  value?: CheckboxOption[];
  options?: CheckboxOption[];
  title?: string;
  color?: Color;
  className?: string;
  btnClassName?: string;
  withCounter?: boolean;
}

export interface CheckboxOption {
  label: string;
  value: string;
}

const Checkbox = ({
  onChange,
  options,
  title,
  value,
  color,
  className,
  btnClassName,
  withCounter,
}: props) => {
  const [isOpen, setOpen] = useState(false);
  const [myValue, setMyValue] = useState<CheckboxOption[]>([]);
  const listRef = useRef(null);

  const selectAll = () => {
    if (options) setMyValue([...options]);

    if (onChange && options) onChange([...options]);
  };

  const clearAll = () => {
    if (options) setMyValue([]);

    if (onChange && options) onChange([]);
  };

  useEffect(() => {
    if (value) setMyValue([...value]);
  }, [value]);

  const renderList = () => {
    return (
      <div
        className={`${isOpen ? "pointer-events-auto " : "pointer-events-none "}
        ${className} absolute top-[50px] bg-slate-800 w-full rounded-lg z-[20] p-2 duration-100 shadow`}
        ref={listRef}
        style={{
          opacity: `${isOpen ? 100 : 0}`,
        }}
      >
        <div className="flex flex-col md:flex-row w-full justify-between mb-1 gap-2">
          <button
            className="bg-slate-700 duration-150 hover:bg-slate-600 rounded-lg px-3 py-1 font-poppins text-sm flex justify-center items-center text-white cursor-pointer"
            onClick={selectAll}
          >
            Wszystko
          </button>
          <button
            className="bg-slate-700 duration-150 hover:bg-slate-600 rounded-lg px-3 py-1 font-poppins text-sm flex justify-center items-center text-white cursor-pointer"
            onClick={clearAll}
          >
            Wyczyść
          </button>
        </div>
        <div className=" max-h-[310px] overflow-y-auto">
          {options?.map((item, index) => {
            return (
              <div key={index} className="flex flex-col">
                {renderOption(item)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOption = (item: CheckboxOption) => {
    return (
      <div
        className="w-full p-2 bg-slate-700 duration-150 hover:bg-slate-600 h-10 my-1 text-white rounded font-semibold flex flex-row items-center cursor-pointer"
        onClick={() => onClickHandler(item)}
      >
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 rounded bg-gray-600 border-gray-500 mr-2"
          checked={!!(myValue.find((val) => val.value === item.value) ?? false)}
          onChange={() => {}}
        />
        <div className="w-11/12 truncate">{item.label}</div>
      </div>
    );
  };

  const onClickHandler = (val: CheckboxOption) => {
    let newMyValue = [...myValue];

    if (newMyValue.find((item) => item.value === val.value)) {
      newMyValue = newMyValue.filter((item) => item.value !== val.value);
    } else {
      newMyValue.push(val);
    }

    if (onChange) onChange(newMyValue);
    setMyValue(newMyValue);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        listRef.current &&
        !(listRef.current as Node).contains(event.target as Node)
      ) {
        setTimeout(() => {
          setOpen(false);
        }, 100);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative w-[200px]">
      <Button
        text={
          withCounter && myValue.length > 0
            ? `${title} (${myValue.length})`
            : title
        }
        onClick={() => setOpen(!isOpen)}
        className={`${btnClassName} w-full`}
        color={color}
      />
      {renderList()}
    </div>
  );
};

export default Checkbox;
