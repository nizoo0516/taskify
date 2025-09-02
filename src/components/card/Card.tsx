// import calendarIcon from "@/assets/icons/icon-calender.svg";
import Chip from "@/components/chip/Chip";

interface CardProps {
  title: string;
  tags: string[];
  date: string;
  image?: string;
}

export default function Card({ title, tags, date, image }: CardProps) {
  return (
    <div className="w-[314px] rounded-[6px] border border-[#D9D9D9] bg-white px-[20px] py-[16px]">
      {/* 이미지 영역 */}
      {image && (
        <img
          src={image}
          alt={title}
          className="mb-[13px] h-[160px] w-full rounded-md object-cover"
        />
      )}

      {/* 제목 */}
      <h3 className="mb-[10px] text-[16px] font-medium text-[#000000]">{title}</h3>

      {/* 태그 영역 */}
      <div className="mb-[13px] flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} variant="category" label={tag} />
        ))}
      </div>

      {/* 날짜 + 작성자 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          {/* <img src={calendarIcon} alt="calendar" className="h-[18px] w-[18px]" /> */}
          <span>{date}</span>
        </div>
        <div className="flex h-[24px] w-[24px] rounded-full bg-green-100 font-bold text-green-700"></div>
      </div>
    </div>
  );
}
