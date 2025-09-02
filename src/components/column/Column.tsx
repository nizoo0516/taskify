import settingsIcon from "/public/icons/icon-settings.svg";
import Card from "@/components/card/Card";
import Chip from "@/components/chip/Chip";

interface CardData {
  title: string;
  tags: string[];
  date: string;
  image?: string;
  author?: string;
}

interface ColumnProps {
  status: string;
  count: number;
  cards: CardData[];
  onAddCard?: () => void;
}

export default function Column({ status, count, cards, onAddCard }: ColumnProps) {
  return (
    <div className="w-[354px] bg-[#FAFAFA] p-5">
      {/* 컬럼 헤더 */}
      <div className="mb-[25px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          {/* 상태 칩 */}
          <Chip variant="status" label={status} />
          {/* 숫자 칩 */}
          <Chip variant="badge" label={count.toString()} />
        </div>
        {/* 설정 버튼 */}
        <button type="button">
          <img src={settingsIcon} alt="설정" className="h-6 w-6" />
        </button>
      </div>

      {/* 카드 추가 버튼 */}
      <div className="mb-4 flex items-center justify-center rounded-md border border-dashed border-gray-300 py-2">
        <Chip variant="add" onClick={onAddCard} />
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-[15px]">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
