import Image from "next/image";
import Link from "next/link";

import { Dashboard } from "@/features/dashboard/types";

import DashboardList from "./DashboardList";
import Pagination from "./Pagination";
import MyButton from "../../Button";

export default function Sidebar({ dashboards }: { dashboards: Dashboard[] }) {
  return (
    <>
      <div>
        {/* 로고 이미지 */}
        <h1 className="h=full tablet:mb-14 mb-8 flex w-full items-center justify-center">
          <Link href={`/`} className="tablet:h=[50px] tablet:w-[110px]">
            <img
              src="/images/img-logo-large.svg"
              alt="로고"
              width={110}
              height={35}
              className="tablet:block hidden"
            />
            <img
              src="/images/img-logo-small.svg"
              alt="로고"
              width={24}
              height={27}
              className="tablet:hidden"
            />
          </Link>
        </h1>
        {/*클릭 시 대시보드 생성 모달 열림*/}
        <div className="tablet:mb-4 mb-6 flex w-full justify-center">
          <MyButton
            className="tablet:justify-between tablet:w-full flex justify-center border-0"
            onClick={() => {}}
          >
            <div className="tablet:flex hidden">Dash Boards</div>
            <Image src={"/icons/icon-box-add.svg"} alt="대시보드 추가" width={14} height={14} />
          </MyButton>
        </div>
        <DashboardList dashboards={dashboards} />
        <Pagination />
      </div>
    </>
  );
}
