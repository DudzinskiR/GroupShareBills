import React from "react";

interface props {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

const Box = ({ children, className, title }: props) => {
  return (
    <div className={`${className} bg-white rounded border-2 shadow`}>
      {title && (
        <div className="w-full pt-5 px-5">
          <div className="text-xl mb-1 font-semibold">{title}</div>
          <div className="w-full border mb-3"></div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Box;
