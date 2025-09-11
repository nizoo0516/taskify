"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export type Option = {
  value: string;
  label: string;
  chip?: React.ReactNode;
  disabled?: boolean;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
  className?: string;
  labelNone?: boolean;
  onSelect?: (option: Option) => void;
  value?: string;
};

export default function Select({
  options,
  placeholder,
  className = "",
  labelNone = false,
  onSelect,
  value,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  // value prop이 변경될 때 selected 업데이트
  useEffect(() => {
    if (value) {
      const foundOption = options.find((opt) => opt.value === value);
      setSelected(foundOption || null);
    } else {
      setSelected(null);
    }
  }, [value, options]);

  const btnClass = [
    "relative w-full",
    "h-12 px-4",
    "rounded-lg border bg-white border-brand-gray-200",
    "text-[16px] text-brand-gray-700 text-left",
    className,
  ].join(" ");

  return (
    <div className="relative">
      <button type="button" onClick={() => setIsOpen((o) => !o)} className={btnClass}>
        {selected ? (
          <div className="flex items-center gap-2">
            {selected?.chip}
            {!labelNone && <span>{selected?.label}</span>}
          </div>
        ) : (
          placeholder
        )}
        <Image
          src="/icons/icon-arrow-dropdown.svg"
          width={26}
          height={26}
          alt="선택 화살표 아이콘"
          className="absolute top-1/2 right-4 -translate-y-1/2"
        />
      </button>

      {isOpen && (
        <ul className="border-brand-gray-200 absolute top-full left-0 z-10 mt-0.5 w-full rounded-md border bg-white shadow">
          {options.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
                onSelect?.(item);
              }}
              className="hover:bg-brand-gray-200 flex h-12 cursor-pointer items-center gap-2 px-4"
            >
              {selected?.value === item.value && (
                <Image
                  src="/icons/icon-dropdown-check.svg"
                  width={22}
                  height={22}
                  alt="선택됨 체크 아이콘"
                />
              )}
              {item.chip}
              {!labelNone && <span>{item.label}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
