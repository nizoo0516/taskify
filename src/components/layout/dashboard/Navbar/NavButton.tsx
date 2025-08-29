import Link from "next/link";

export default function inviteButton({ id }: { id: number }) {
  return (
    <>
      <Link href={`/dashboard/${id}/edit`}>관리</Link>
      {/* 모달 연결 해야함 */}
      <button>초대하기</button>
    </>
  );
}
