// lib/api/cards.ts
import api from "../axios";

// 카드 생성
export const postCard = (data: any) => api.post("/cards", data);

// 카드 목록 조회
export const getCards = () => api.get("/cards");

// 카드 상세 조회
export const getCardDetail = (id: string) => api.get(`/cards/${id}`);

// 카드 수정
export const putCard = (id: string, data: any) => api.put(`/cards/${id}`, data);

// 카드 삭제
export const deleteCard = (id: string) => api.delete(`/cards/${id}`);
