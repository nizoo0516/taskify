// POST: 대시보드 생성, PUT(id): 대시보드 수정
export interface CreateDashboardRequest {
  title: string;
  color: string;
}

// 대시보드 목록(응답)
export interface Dashboard {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
  userId: number;
}

// GET:대시보드 목록 조회(응답)
export interface GetDashboardsResponse {
  cursorId: number | null;
  totalCount: number;
  dashboards: Dashboard[];
}

// DELETE(id): 대시보드 삭제
export type DeleteDashboardResponse = void;

// POST(id/invitations): 대시보드 초대하기
export interface InvitationRequest {
  email: string;
}

// POST(id/invitations): 대시보드 초대하기(응답), GET: 대시보드 초대 불러오기(응답)
export interface Invitation {
  id: number;
  inviter: {
    id: number;
    email: string;
    nickname: string;
  };
  teamId: string;
  dashboard: {
    id: number;
    title: string;
  };
  invitee: {
    id: number;
    email: string;
    nickname: string;
  };
  inviteAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET: 대시보드 초대 불러오기(응답)
export interface GetInvitationResponse {
  totalCount: number;
  invitations: Invitation[];
}

// DELETE(id/invitations/id): 대시보드 초대 취소
export type DeleteInvitationResponse = void;

// 카드 데이터 타입
export interface CardData {
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl?: string;
  author?: string;
  id?: number;
}
// 컬럼 타입
export interface ColumnData {
  id: number;
  title: string;
  cards?: CardData[];
}
// 컬럼 컴포넌트 타입
export interface ColumnProps {
  status: string;
  cards: CardData[];
  onAddCard?: () => void;
  kebabIndex: boolean;
  isKebabOpen?: () => void;
  columnId: number;
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
}
