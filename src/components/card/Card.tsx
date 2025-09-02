import calendarIcon from "@/assets/icons/icon-calender.svg";
import Chip from "@/components/chip/Chip";

interface CardProps {
  title: string;
  tags: string[];
  date: string;
  image?: string;
  author: string;
}

export default function Card({ title, tags, date, image, author }: CardProps) {
  return (
    <div className="w-[314px] rounded-[6px] border border-[#D9D9D9] bg-white">
      {/* 이미지 영역 */}
      {image && (
        <img
          src={image}
          alt={title}
          className="mb-[13px] h-[160px] w-full rounded-md object-cover"
        />
      )}

      {/* 제목 */}
      <h3 className="mb-[10px] text-sm font-medium text-gray-900">{title}</h3>

      {/* 태그 영역 */}
      <div className="mb-[13px] flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} variant="category" label={tag} />
        ))}
      </div>

      {/* 날짜 + 작성자 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <img src={calendarIcon} alt="calendar" className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
          {author}
        </div>
      </div>
    </div>
  );
}
