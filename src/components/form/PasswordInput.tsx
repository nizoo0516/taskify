"use client";

import Image from "next/image";

export const MIN_PASSWORD_LEN = 8;

export function getPwError(pw: string, min = MIN_PASSWORD_LEN): string | undefined {
  if (!pw) return undefined;
  return pw.length >= min ? undefined : `8자 이상 작성해 주세요.`;
}

export function getPwConfirmError(pw: string, confirm: string): string | undefined {
  if (!confirm) return undefined;
  return pw === confirm ? undefined : "비밀번호가 일치하지 않습니다.";
}

type ToggleProps = {
  show: boolean;
  onToggle: () => void;
  controlsId: string;
  className?: string;
  toggleOn?: string;
  toggleOff?: string;
  size?: "sm" | "md";
};

export function PasswordToggle({
  show,
  onToggle,
  controlsId,
  className = "",
  toggleOn = "비밀번호 숨기기",
  toggleOff = "비밀번호 보기",
  size = "md",
}: ToggleProps) {
  const box = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const icon = size === "sm" ? 18 : 24;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={show}
      aria-controls={controlsId}
      className={`absolute top-1/2 right-0.5 flex -translate-y-1/2 items-center justify-center text-gray-500 ${box} ${className}`}
    >
      <Image
        src={show ? "/icons/icon-eye-close.svg" : "/icons/icon-eye-open.svg"}
        alt="비밀번호 토글"
        width={icon}
        height={icon}
      />
    </button>
  );
}
