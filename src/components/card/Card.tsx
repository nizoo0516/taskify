import clsx from "clsx";
import Image from "next/image";

import Chip from "@/components/chip/Chip";

interface CardProps {
  title: string;
  tags: string[];
  date: string;
  image?: string;
  author?: {
    profileImageUrl: string;
    nickname: string;
  };
}

export default function Card({ title, tags, date, image, author }: CardProps) {
  return (
    <div
      className={clsx(
        // 기본 (mobile)
        "flex w-full flex-col gap-4 rounded-md border border-[#D9D9D9] bg-white p-5",

        // tablet
        "tablet:w-full tablet:h-[112px] tablet:flex-row tablet:items-start tablet:gap-4 tablet:px-5",

        // pc
        "pc:w-[314px] pc:flex-col pc:h-auto pc:py-4",
      )}
    >
      {/* 이미지 영역 */}
      {image && (
        <Image
          src={image}
          alt={title}
          width={274}
          height={160}
          className={clsx(
            "rounded-md object-cover",
            // 기본 (mobile)
            "h-auto w-full object-cover",

            // tablet
            "tablet:h-auto tablet:w-[120px]",

            // pc
            "pc:h-[160px] pc:w-[274px]",
          )}
        />
      )}

      <div className="tablet:gap-4 pc:gap-2 flex w-full flex-1 flex-col items-start gap-2">
        {/* 제목 */}
        <h3 className="text-base font-medium text-[#000000]">{title}</h3>

        <div
          className={clsx(
            // 기본 (mobile)
            "flex w-full flex-col gap-3",

            // tablet
            "tablet:flex-row tablet:items-center tablet:justify-between",

            // pc
            "pc:flex-col pc:items-start pc:gap-3",
          )}
        >
          {/* 태그 영역 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip key={tag} variant="category" label={tag} />
            ))}
          </div>

          {/* 날짜 + 작성자 */}
          <div className="tablet:justify-start tablet:gap-4 pc:justify-between pc:w-full flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Image src="/icons/icon-calender.svg" alt="calendar" width={18} height={18} />
              <span>{date}</span>
            </div>

            {author && (
              <img
                src={author.profileImageUrl}
                alt={author.nickname}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
