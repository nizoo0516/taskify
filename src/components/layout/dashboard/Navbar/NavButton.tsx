import MyButton from "@/components/layout/Button";

type NavButtonProps = {
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string;
};

export default function NavButton({ icon, label, onClick = () => {}, className }: NavButtonProps) {
  return (
    <MyButton
      onClick={onClick}
      className={`text-xl-medium flex items-center justify-center px-3 ${className}`}
    >
      <img src={icon} alt={`${label} 아이콘`} className="tablet:inline-block mr-2 hidden h-4 w-4" />
      <span className="text-brand-gray-500">{label}</span>
    </MyButton>
  );
}
