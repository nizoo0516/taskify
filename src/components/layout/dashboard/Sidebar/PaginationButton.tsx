import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type paginationprops = {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
};

export default function PaginationButton({
  direction,
  disabled = false,
  onClick,
}: paginationprops) {
  const buttonStyle = cn(
    "border-brand-gray-300 border flex h-10 w-10 justify-center px-2 py-1 disabled:opacity-50",
  );
  const imgStyle = cn("caret-brand-gray-500 disabled:to-brand-gray-300");

  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(buttonStyle, direction === "prev" ? "rounded-l-[4px]" : "rounded-r-[4px]")}
      >
        <Image
          src={"/icons/icon-arrow-right.svg"}
          alt={direction}
          width={16}
          height={16}
          className={cn(imgStyle, direction === "prev" && "rotate-180")}
        />
      </button>
    </>
  );
}
