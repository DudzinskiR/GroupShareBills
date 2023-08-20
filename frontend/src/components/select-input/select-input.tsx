import React from "react";

interface props {
  className?: string;
  options?: SelectOption[];
  value?: SelectOption;
  onChange?: (val: SelectOption) => void;
  dark?: boolean;
}

export interface SelectOption {
  label?: string;
  value?: string;
}

const SelectInput = ({
  className = " ",
  options,
  value,
  onChange,
  dark,
}: props) => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange)
      onChange({
        label: event.currentTarget.innerText,
        value: event.currentTarget.value,
      });
  };

  return (
    <select
      className={`${className} ${
        dark
          ? "bg-slate-600 border border-slate-900 text-slate-50"
          : "bg-slate-100 border-slate-300 text-slate-800"
      }  text-sm rounded-lg block p-2.5`}
      onChange={onChangeHandler}
      value={value?.value}
    >
      {options?.map((item, index) => {
        return (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
