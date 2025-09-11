import React from "react";

import { base, asInput } from "./ControlStyles";

type InputProps = React.ComponentPropsWithRef<"input"> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

function Input({ className, leftIcon, rightIcon, ...props }: InputProps) {
  return (
    // 부모 클래스 합쳐서 적용
    <div className={`relative w-full ${className ?? ""}`}>
      {leftIcon && (
        // 좌측에 위치한 아이콘
        <span className="text-brand-gray-400 absolute top-1/2 left-4 -translate-y-1/2">
          {leftIcon}
        </span>
      )}
      <input
        className={[base, asInput, leftIcon ? "pl-[46px]" : "", rightIcon ? "pr-[46px]" : ""].join(
          " ",
        )}
        {...props}
      />
      {/* 우측에 위치한 아이콘 */}
      {rightIcon && (
        <div className="text-brand-gray-400 absolute top-1/2 right-4 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export default Input;
