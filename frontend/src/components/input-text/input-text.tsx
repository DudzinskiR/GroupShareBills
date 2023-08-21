import React, { useEffect, useState } from "react";

interface props {
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  type?: "password" | "text" | "number";
  error?: boolean;
  className?: string;
  min?: string;
  max?: string;
}

const InputText = ({
  value,
  onChange,
  label,
  type = "text",
  error,
  className = "",
  min,
  max,
}: props) => {
  const [localError, setLocalError] = useState(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setLocalError(false);
    }
    if (onChange) {
      let newValue = e.target.value;
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (value !== "") {
      setLocalError(error ?? false);
    }
  }, [error, value]);

  return (
    <div className={`${className} relative`}>
      <input
        type={type}
        value={value}
        onChange={onChangeHandler}
        className={`${
          localError
            ? "focus:border-red-500 focus:bg-red-100 border-red-400 bg-red-50"
            : "focus:border-sky-500 focus:bg-sky-50/10 border-sky-400"
        } peer h-10 w-full border-b-4 placeholder-transparent border-0 focus:outline-0 bg-transparent`}
        placeholder=" "
        min={min}
        max={max}
      />
      <label className="absolute pointer-events-none left-0 select-none -top-2.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
        {label}
      </label>
    </div>
  );
};

export default InputText;
