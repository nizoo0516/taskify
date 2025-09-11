import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  const btnData = [
    { href: "/login", text: "로그인하러가기", style: "bg-brand-blue-500 text-white" },
    {
      href: "/",
      text: "홈으로가기",
      style: "bg-white text-brand-blue-500 border-brand-blue-500 border-1",
    },
  ];

  const pStyle = cn("text-xs", "tablet:text-sm font-medium text-brand-gray-400 leading-6");

  return (
    <>
      <div className="bg-brand-gray-100 tablet:py-0 flex h-full flex-col items-center justify-center py-10 text-center">
        <div className="tablet:-mb-11">
          <h1 className={cn("text-brand-blue-500 text-2lg mb-3.5 font-bold", "tablet:text-3xl")}>
            앗, 접근할 수 없는 페이지입니다
          </h1>
          <p className={cn(pStyle)}>잘못된 주소이거나 권한이 없는 페이지입니다.</p>
          <p className={cn(pStyle)}>로그인 후 다시 이용해주세요.</p>
        </div>

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={cn("w-[287px]", "tablet:mb-1.5 tablet:w-[538px]", "pc:w-[820px]")}
        >
          <source src="/video/Loading_Animation.webm" type="video/webm" />
        </video>

        <div
          className={cn("flex flex-col gap-3", "tablet:flex-row tablet:gap-[60px]", "pc:gap-20")}
        >
          {/* onClick이 들어갈 수 없어서 Mybutton의 onClick 선택사항으로 변경가능한지 확인 */}
          {btnData.map((b, i) => (
            <Link key={i} href={b.href}>
              <button
                className={cn(
                  b.style,
                  "h-[46px] w-[240px] rounded-lg text-sm font-medium",
                  "tablet:text-lg tablet:h-[46px] tablet:w-[260px]",
                  "pc:h-[54px] pc:w-[280px]",
                )}
              >
                {b.text}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
