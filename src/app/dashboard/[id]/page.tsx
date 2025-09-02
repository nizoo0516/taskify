import Card from "@/components/card/Card";

export default function DashboardId() {
  return (
    <>
      <div className="">
        <Card
          title="새로운 일정 관리 Taskify"
          tags={["프로젝트", "백엔드", "상"]}
          date="2025.09.01"
        />
      </div>
    </>
  );
}
