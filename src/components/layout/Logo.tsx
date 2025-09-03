"use client";

import Image from "next/image";
import Link from "next/link";

import { useIsLoggedIn } from "@/features/auth/store";

type LogoProps = {
  isHome?: boolean;
};

export default function Logo({ isHome = true }: LogoProps) {
  const isLoggedIn = useIsLoggedIn();
  const linkHref = isLoggedIn ? "/mydashboard" : "/";

  const logoStyle = `${isHome ? "create-white" : ""}`;

  return (
    <>
      {/* Image를 디바이스로 관리해서 src를 변경되게 하는게 나은가 아님 이렇게 따로 관리하는게 나은가 */}
      <h1>
        <Link href={linkHref} className="tablet:h-[50px] tablet:w-[110px]">
          <Image
            src="/images/img-logo-large.svg"
            alt="로고"
            width={isHome ? 121 : 110}
            height={35}
            className={`tablet:block hidden ${logoStyle}`}
          />
          <Image
            src="/images/img-logo-small.svg"
            alt="로고"
            width={24}
            height={27}
            className={`tablet:hidden ${logoStyle}`}
          />
        </Link>
      </h1>
    </>
  );
}
