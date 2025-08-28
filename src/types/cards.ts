// POST: 카드 생성, Put(id): 카드 수정
export interface CardRequest {
  assigneeUserId: number;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl?: string;
}

// GET: 카드 목록 조회, GET(id): 카드 상세조회
export interface Card {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string;
  assignee: Assignee | null;
  imageUrl?: string;
  teamId: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
}

// GET > assignee 정보
export interface Assignee {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

// 카드 목록 조회 응답
export interface GetCardsResponse {
  cursorId: number;
  totalCount: number;
  cards: Card[];
}
