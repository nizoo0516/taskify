import React from "react";

import Input from "./Input";

type PasswordProps = Omit<React.ComponentPropsWithRef<"input">, "type"> & { className?: string };

export default function PasswordInput({ className, ...rest }: PasswordProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <Input
      type={visible ? "text" : "password"}
      className={className}
      rightIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보이기"}
          className="inline-flex"
        >
          {/* 아이콘 추가 시 교체 */}
          아이콘
        </button>
      }
      {...rest}
    />
  );
}
