import React from "react";

interface props {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

const Box = ({ children, className, title }: props) => {
  return (
    <div className={`${className} bg-white rounded border-2 shadow`}>
      {children}
    </div>
  );
};

export default Box;
