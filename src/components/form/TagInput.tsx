"use client";
import { useState } from "react";

import Chip from "@/components/common/chip/Chip";

export type Tag = {
  label: string;
  color: { bg: string; text: string };
};

type TagInputProps = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
};

const colorVariants = [
  { bg: "bg-[#F9EEE3]", text: "text-[#D58D49]" },
  { bg: "bg-[#E9F3E1]", text: "text-[#5A8F2F]" },
  { bg: "bg-[#DBE6F7]", text: "text-[#4981D5]" },
  { bg: "bg-[#F7DBF0]", text: "text-[#D549B6]" },
];

export default function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [skipChange, setSkipChange] = useState(false);

  // 엔터 시 태그 확정
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const newLabel = inputValue.trim();
    if (!newLabel || value.some((tag) => tag.label === newLabel)) return;

    const randomColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    onChange([...value, { label: newLabel, color: randomColor }]);
    setInputValue("");
    setSkipChange(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (skipChange) {
      setSkipChange(false);
      return;
    }
    setInputValue(e.currentTarget.value);
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="border-brand-gray-200 dark:bg-dark-900 flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-lg border px-2 py-2">
      {/* 확정된 태그들 */}
      {value.map((tag, i) => (
        <div key={i} className="flex items-center gap-1">
          <Chip variant="category" label={tag.label} color={tag.color} />
          <button type="button" onClick={() => removeTag(i)} className="text-xs text-gray-500">
            ×
          </button>
        </div>
      ))}

      {/* 입력창 */}
      <input
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        placeholder={value.length === 0 ? "태그 입력 후 Enter" : ""}
        className="flex-1 bg-transparent outline-none"
      />
    </div>
  );
}
