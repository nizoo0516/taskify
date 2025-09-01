import Image from "next/image";

import { Dashboard } from "@/features/dashboard/types";
import { cn } from "@/lib/utils/cn";

import MyButton from "../../Button";
export default function DashboardList({ dashboards }: { dashboards: Dashboard[] }) {
  const hoverStyle = cn("tablet:hover:bg-brand-blue-50 rounded-[4px]");
  return (
    <>
      <ul>
        {dashboards.map((d: Dashboard) => {
          const createdByMe = d.createdByMe;
          return (
            <li
              key={d.id}
              className={cn(
                hoverStyle,
                "tablet:justify-start tablet:mb-0 mb-6 flex justify-center",
              )}
            >
              <MyButton
                className="tablet:w-full tablet:px-2.5 tablet:py-2 tablet:justify-start flex items-center justify-center gap-4 border-0 bg-transparent"
                onClick={() => {}}
              >
                <div
                  style={{ backgroundColor: d.color }}
                  className="h-2 w-2 shrink-0 rounded-full"
                ></div>
                <div className="tablet:flex hidden w-full min-w-0 items-center justify-start gap-1">
                  <div className="pc:text-2lg tablet:text-lg tablet:inline-block hidden truncate font-medium">
                    {d.title}
                  </div>
                  {createdByMe && (
                    <Image
                      src={"/icons/icon-crown.svg"}
                      alt="내가만든 대시보드"
                      width={18}
                      height={14}
                    />
                  )}
                </div>
              </MyButton>
            </li>
          );
        })}
      </ul>
    </>
  );
}
