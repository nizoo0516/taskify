"use client";
import dayjs from "dayjs";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import DetailCardModal from "@/components/modal/cardModal/DetailCardModal";
import Chip from "@/components/common/chip/Chip";
import { CardData } from "@/features/dashboard/types";

type CardWithAssignee = CardData & {
  assignee?: {
    id: number;
    nickname: string;
    profileImageUrl?: string;
  };
};

export default function Card({ title, tags, dueDate, imageUrl, assignee }: CardWithAssignee) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={clsx(
        // 기본 (mobile)
        "border-brand-gray-300 flex w-full cursor-pointer flex-col gap-4 rounded-md border bg-white p-5",

        // tablet
        "tablet:w-full tablet:h-[112px] tablet:flex-row tablet:items-start tablet:gap-4 tablet:px-5",

        // pc
        "pc:w-[314px] pc:flex-col pc:h-auto pc:py-4",
      )}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      {/* 이미지 영역 */}
      {imageUrl && (
        <Image
          src={imageUrl}
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
        <h3 className="text-base font-medium text-black">{title}</h3>

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
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => <Chip key={index} variant="category" label={tag} />)
            ) : (
              <span className="text-xs text-gray-400">태그 없음</span>
            )}
          </div>

          {/* 날짜 + 작성자 */}
          <div className="tablet:justify-start tablet:gap-4 pc:justify-between pc:w-full flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Image src="/icons/icon-calender.svg" alt="calendar" width={18} height={18} />
              <span>{dayjs(dueDate).format("YYYY.MM.DD")}</span>
            </div>

            {assignee?.profileImageUrl ? (
              <img
                src={assignee.profileImageUrl}
                alt={assignee.nickname}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <img
                src="/images/img-profile-sample.svg"
                alt="기본 프로필"
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && <DetailCardModal isOpen setIsOpen={setIsOpen} />}
    </div>
  );
}
