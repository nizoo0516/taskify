"use client";

import { ReactNode } from "react";

interface MyButtonProps {
  //text: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  color?: "buttonBasic" | "buttonBlue" | "buttonGrey" | "buttonWhite";
  disabled?: boolean;
}

/*기본은 primary며, primary는 흰바탕, secondary는 보라배경, danger는 회색배경입니다*/
export default function MyButton({
  children,
  onClick,
  className = "",
  color = "buttonBasic",
}: MyButtonProps) {
  const colorClasses = {
    buttonBasic: "border border-brand-gray-300",
    buttonBlue: "bg-brand-blue-500 border border-brand-blue-500 text-[#ffffff]",
    buttonGrey: "bg-[#9fa6b2] border border-brand-gray-400 text-[#ffffff]",
    buttonWhite: "bg-white border border-white hover:bg-brand-blue-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg text-sm ${className} ${colorClasses[color]}`}
      disabled={false}
    >
      {children}
    </button>
  );
}
