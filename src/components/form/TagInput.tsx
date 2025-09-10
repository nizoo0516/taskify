"use client";
import { useState } from "react";

import Chip from "@/components/common/chip/Chip";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [skipChange, setSkipChange] = useState(false);

  // 엔터 시 태그 확정
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // 기본 submit 막기

    const newTag = inputValue.trim();
    if (!newTag || value.includes(newTag)) return;

    onChange([...value, newTag]);
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
          <Chip variant="category" label={tag} />
          <button type="button" onClick={() => removeTag(i)} className="text-xs text-gray-500">
            ×
          </button>
        </div>
      ))}

      {/* 공용 Input 컴포넌트 */}
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
