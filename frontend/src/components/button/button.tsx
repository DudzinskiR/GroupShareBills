import React, { ReactNode } from "react";

export enum Color {
  BLUE = "bg-gradient-to-r from-sky-500 to-indigo-500",
  RED = "bg-gradient-to-r from-red-500 to-rose-600",
  GREEN = "bg-gradient-to-r from-lime-600 to-green-600",
  PURPLE = "bg-gradient-to-r from-indigo-500 to-indigo-600 ",
}

interface props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
  className?: string;
  color?: Color;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  centerIcon?: ReactNode;
  enabled?: boolean;
  rounded?: boolean;
}

const Button = ({
  className,
  onClick,
  color,
  text,
  leftIcon,
  centerIcon,
  rightIcon,
  rounded,
  enabled = true,
}: props) => {
  return (
    <button
      className={`
      ${className} 
      ${color || Color.BLUE}
      ${
        enabled
          ? "cursor-pointer hover:saturate-[1.5] duration-100"
          : "saturate-0 cursor-default"
      }
      ${rounded ? "rounded-full" : "rounded-lg"}
      flex justify-center items-center shadow-md text-white font-semibold select-none p-2
      `}
      onClick={(e) => {
        if (onClick && enabled) onClick(e);
      }}
    >
      {leftIcon && <div className="text-2xl">{leftIcon}</div>}
      <div className="px-2">
        {text}
        {centerIcon}
      </div>
      {rightIcon && <div className="text-2xl">{rightIcon}</div>}
    </button>
  );
};

export default Button;
