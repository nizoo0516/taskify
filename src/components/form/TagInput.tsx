import { useState } from "react";

import Chip from "@/components/common/chip/Chip";
import Input from "@/components/form/Input";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [previewTags, setPreviewTags] = useState<string[]>([]);

  // 엔터 시 미리보기 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const input = e.currentTarget;
    const newTag = input.value.trim();
    if (!newTag) return;

    setPreviewTags((prev) => [...prev, newTag]);
    setInputValue("");
    input.value = "";
  };

  // 미리보기 클릭 시 input에 들어감
  const confirmTag = (tag: string, idx: number) => {
    onChange([...value, tag]);
    setPreviewTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeTag = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="relative">
      <Input
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        placeholder="태그 입력 후 Enter"
      />

      <div className="absolute top-2.5 left-0 w-full">
        {/* 미리보기 태그 */}
        <div className="bg-brand-gray-200/80 absolute top-10 flex w-full gap-2 rounded-lg px-4 py-3">
          {previewTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => confirmTag(tag, i)}
              className={
                "inline-flex h-7 min-w-[25px] items-center justify-center rounded px-[6px] text-sm " +
                "bg-[#F9EEE3] text-[#D58D49]"
              }
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 확정된 태그 */}
        <div className="absolute flex w-full gap-2 rounded-lg px-4">
          {value.map((tag, i) => (
            <div key={`tag-${i}`} className="flex items-center gap-1">
              <Chip variant="category" label={tag} />
              <button onClick={() => removeTag(i)}>x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
