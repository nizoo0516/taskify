export default function Comment() {
  return (
    <div className="flex gap-2.5">
      <div className="bg-brand-orange flex h-[34px] w-[34px] items-center justify-center rounded-full font-bold text-white">
        C
      </div>
      <div className="text-sm">
        <div className="flex items-end gap-2">
          <p className="font-bold">정만철</p>
          <span className="text-brand-gray-400 text-xs">댓글생성 날짜</span>
        </div>
        <p>오늘안에 CCC까지 만들 수 있을까요?</p>
        <div className="text-brand-gray-400 flex justify-start gap-3.5 underline underline-offset-2">
          <button>수정</button>
          <button>삭제</button>
        </div>
      </div>
    </div>
  );
}
