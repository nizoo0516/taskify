export const base = [
  "w-full rounded-lg border bg-[var(--input-bg)] text-base text-[var(--text-primary)] outline-none",
  "border-[var(--border)] placeholder:text-[var(--placeholder)]",
  "aria-[invalid=true]:border-red-500",
  "focus:aria-[invalid=true]:border-red-500",
].join(" ");

export const asInput = "h-[50px] px-4";

export const asPassword = asInput;

export const asTextarea = "min-h-[40px] px-4 pt-[15px]";

// 원래 화살표 숨김
export const asSelect = "h-[50px] px-4 appearance-none";
