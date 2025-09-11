import { cn } from "@/lib/utils/cn";

type KebabProps = {
  children: React.ReactNode;
  className?: string;
};

export default function KebabModal({ children, className }: KebabProps) {
  return (
    <div
      className={cn(
        "absolute",
        "flex flex-col px-0.5 py-1",
        "tablet:px-1.5 tablet:py-[7px]",
        "border-brand-gray-300 rounded-md border bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
