import { Dashboard } from "@/features/dashboard/types";
import { cn } from "@/lib/utils/cn";
import MyButton from "../../Button";

export default function DashboardList({ dashboards }: { dashboards: Dashboard[] }) {
  const hoverStyle = cn("tablet:hover:bg-brand-blue-50 rounded-[4px]");

  return (
    <>
      <ul>
        {dashboards.map((d: Dashboard) => (
          <li
            key={d.id}
            className={cn(hoverStyle, "tablet:justify-start tablet:mb-0 mb-6 flex justify-center")}
          >
            <MyButton
              className="tablet:w-full flex items-center gap-4 border-0 bg-transparent px-2.5 py-2"
              onClick={() => {}}
            >
              <div style={{ backgroundColor: d.color }} className="h-2 w-2 rounded-full"></div>
              <div className="pc:text-2lg tablet:text-lg tablet:inline-block hidden truncate font-medium">
                {d.title}
              </div>
            </MyButton>
          </li>
        ))}
      </ul>
    </>
  );
}
