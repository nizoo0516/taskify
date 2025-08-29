import { asTextarea, base } from "./ControlStyles";

type TextareaProps = React.ComponentPropsWithRef<"textarea"> & { className?: string };

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      // 부모 클래스 합쳐서 적용
      className={[base, asTextarea, className ?? ""].join(" ")}
      {...props}
    />
  );
}
