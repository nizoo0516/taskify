"use client";

import { useState, useEffect } from "react";

import Field from "@/components/form/Field";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/layout/Button";
import { useColumnId } from "@/features/columns/store";
import { createComment, updateComment, deleteComment, getComments } from "@/features/comments/api";

// 댓글 타입 정의
interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    profileImageUrl?: string;
    nickname?: string;
  };
}

export default function Comment() {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { columnIdData } = useColumnId();
  const cardId = columnIdData?.cardId ?? 0;
  const dashboardId = columnIdData?.dashboardId ?? 0;
  const columnId = columnIdData?.columnId ?? 0;

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    if (!cardId) return;

    try {
      const response = await getComments(cardId, { size: 10 });
      const commentsData = "data" in response ? response.data : response;

      // API 응답 구조에 따른 처리
      if (commentsData && typeof commentsData === "object") {
        if ("comments" in commentsData) {
          setComments(commentsData.comments || []);
        } else if (Array.isArray(commentsData)) {
          setComments(commentsData);
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      console.error("댓글 목록 불러오기 실패:", error);
      setComments([]);
    }
  };

  // 컴포넌트 마운트 시 댓글 목록 불러오기
  useEffect(() => {
    if (cardId) {
      fetchComments();
    }
  }, [cardId]);

  // 댓글 생성
  const handleCreate = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await createComment({
        content: input.trim(),
        cardId,
        columnId,
        dashboardId,
      });

      const newComment = "data" in response ? response.data : response;

      // 새 댓글을 목록에 추가
      setComments((prev) => [newComment, ...prev]);
      setInput(""); // 입력창 초기화
    } catch (error) {
      console.error("댓글 생성 실패:", error);
      alert((error as Error).message || "댓글 생성 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  // 댓글 수정 완료
  const handleEditComplete = async (commentId: number) => {
    if (!editingContent.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await updateComment(commentId, { content: editingContent.trim() });
      const updatedComment = "data" in response ? response.data : response;

      // 댓글 목록에서 해당 댓글 업데이트
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment)),
      );

      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert((error as Error).message || "댓글 수정 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      await deleteComment(commentId);

      // 댓글 목록에서 해당 댓글 제거
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert((error as Error).message || "댓글 삭제 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 댓글 입력 영역 */}
      <Field id="comment" label="댓글">
        <div className="rounded-lg border border-[#D9D9D9] p-3">
          <Textarea
            placeholder="댓글 작성하기"
            className="resize-none rounded-none border-0 !p-0"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={isLoading}
          />
          <div className="mt-1 flex justify-end">
            <Button
              color="buttonBasic"
              onClick={handleCreate}
              className="text-brand-blue-500 h-8 w-20"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? "작성 중..." : "입력"}
            </Button>
          </div>
        </div>
      </Field>

      {/* 댓글 목록 */}
      <div className="flex max-h-80 flex-col gap-4 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2.5">
            <div className="bg-brand-orange flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
              {comment.author?.profileImageUrl ? (
                <img
                  src={comment.author.profileImageUrl}
                  alt="프로필"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                comment.author?.nickname?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div className="flex-1 text-sm">
              <div className="flex items-end gap-2">
                <p className="font-bold">{comment.author?.nickname || "익명"}</p>
                <span className="text-brand-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
              </div>

              {/* 수정 중인 댓글 */}
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.currentTarget.value)}
                    className="w-full resize-none rounded border border-gray-300 p-2 text-sm"
                    rows={2}
                    disabled={isLoading}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditComplete(comment.id)}
                      className="text-xs text-blue-500 underline underline-offset-2"
                      disabled={!editingContent.trim() || isLoading}
                    >
                      {isLoading ? "수정 중..." : "완료"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="text-xs text-gray-500 underline underline-offset-2"
                      disabled={isLoading}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-1">{comment.content}</p>
                  <div className="text-brand-gray-400 mt-2 flex justify-start gap-3.5 underline underline-offset-2">
                    <button
                      onClick={() => handleEditStart(comment.id, comment.content)}
                      disabled={isLoading}
                      className="text-xs hover:text-gray-600"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={isLoading}
                      className="text-xs hover:text-gray-600"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-brand-gray-400 py-4 text-center">아직 댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
