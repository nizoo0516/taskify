"use client";
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Field from "@/components/form/Field";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/common/Button";
import { Comment } from "@/features/comments/types";
import { createComment, updateComment, deleteComment, getComments } from "@/features/comments/api";

interface CommentListProps {
  cardId?: number;
  columnId?: number;
  dashboardId?: number;
}

export default function CommentList({ cardId, columnId, dashboardId }: CommentListProps) {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursorId, setCursorId] = useState<number | null>(null);

  // cardId 유효성 검증 함수 추가
  const isValidCardId = (id?: number): id is number => {
    return typeof id === "number" && Number.isInteger(id) && id > 0;
  };

  // 댓글 목록 불러오기
  const fetchComments = useCallback(
    async (reset = false) => {
      // cardId 유효성 검증을 먼저 수행
      if (!isValidCardId(cardId)) {
        console.warn("Invalid cardId:", cardId);
        if (reset) {
          setComments([]);
          setHasMore(false);
        }
        return;
      }

      try {
        setIsLoading(true);

        const response = await getComments(cardId, {
          size: 10,
          cursorId: reset ? undefined : (cursorId ?? undefined),
        });

        // API 응답 구조 정규화
        const data =
          response && typeof response === "object" && "data" in response
            ? (response as any).data
            : response;

        if (!data || typeof data !== "object") {
          console.warn("Invalid comments response:", response);
          if (reset) setComments([]);
          return;
        }

        let newComments: Comment[] = [];
        let nextCursorId: number | null = null;

        // GetCommentsResponse 형태인지 확인
        if ("comments" in data && Array.isArray(data.comments)) {
          newComments = data.comments;
          nextCursorId = data.cursorId ?? null;
        } else if (Array.isArray(data)) {
          // 배열 형태의 응답
          newComments = data;
          nextCursorId = null;
        }

        if (reset) {
          setComments(newComments);
        } else {
          setComments((prev) => [...prev, ...newComments]);
        }

        setCursorId(nextCursorId);
        setHasMore(nextCursorId !== null && newComments.length > 0);
      } catch (error) {
        console.error("댓글 목록 불러오기 실패:", error);
        if (reset) {
          setComments([]);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cardId, cursorId],
  );

  // 추가 댓글 불러오기 (무한 스크롤)
  const fetchMoreComments = useCallback(async () => {
    if (!hasMore || isLoading || !isValidCardId(cardId)) return;
    await fetchComments(false);
  }, [hasMore, isLoading, fetchComments, cardId]);

  // 컴포넌트 마운트 시 댓글 목록 불러오기
  useEffect(() => {
    if (isValidCardId(cardId)) {
      // 상태 초기화 후 댓글 불러오기
      setComments([]);
      setCursorId(null);
      setHasMore(true);
      fetchComments(true);
    } else {
      // cardId가 유효하지 않으면 상태 초기화
      setComments([]);
      setCursorId(null);
      setHasMore(false);
    }
  }, [cardId]); // fetchComments는 의존성에서 제외 (무한 루프 방지)

  // 댓글 생성
  const handleCreate = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !isValidCardId(cardId) || !columnId || !dashboardId) return;

    setIsLoading(true);
    try {
      const response = await createComment({
        content: trimmedInput,
        cardId,
        columnId,
        dashboardId,
      });

      const newComment =
        response && typeof response === "object" && "data" in response
          ? (response as { data: Comment }).data
          : (response as Comment);

      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (error) {
      console.error("댓글 생성 실패:", error);
      alert((error as Error).message || "댓글 생성에 실패했습니다.");
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
    const trimmedContent = editingContent.trim();
    if (!trimmedContent || isLoading) return;

    setIsLoading(true);
    try {
      const response = await updateComment(commentId, { content: trimmedContent });

      const updatedComment =
        response && typeof response === "object" && "data" in response
          ? (response as { data: Comment }).data
          : (response as Comment);

      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updatedComment : comment)),
      );

      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert((error as Error).message || "댓글 수정에 실패했습니다.");
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
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert((error as Error).message || "댓글 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm");
  };

  // 프로필 이미지 또는 초기 표시
  const renderProfileImage = (author: Comment["author"]) => {
    if (author?.profileImageUrl) {
      return (
        <img
          src={author.profileImageUrl}
          alt={`${author.nickname} 프로필`}
          className="h-full w-full rounded-full object-cover"
        />
      );
    }
    return author?.nickname?.charAt(0)?.toUpperCase() || "U";
  };

  // cardId 유효성 검증 실패 시 UI
  if (!isValidCardId(cardId)) {
    return (
      <div className="py-4 text-center text-gray-500">
        {cardId === undefined
          ? "카드 정보를 불러오는 중..."
          : `유효하지 않은 카드입니다. (cardId: ${cardId})`}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 댓글 입력 영역 */}
      <Field id="comment" label="댓글">
        <div className="border-brand-gray-300 rounded-lg border p-3">
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
              disabled={!input.trim() || isLoading || !columnId || !dashboardId}
            >
              {isLoading ? "작성 중..." : "입력"}
            </Button>
          </div>
        </div>
      </Field>

      {/* 댓글 목록 - 무한 스크롤 */}
      <div className="max-h-80 overflow-y-auto" id="scrollableDiv">
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMoreComments}
          hasMore={hasMore}
          loader={
            <div className="py-4 text-center text-sm text-gray-500">댓글을 불러오는 중...</div>
          }
          endMessage={
            comments.length > 0 ? (
              <div className="py-4 text-center text-sm text-gray-400">
                모든 댓글을 불러왔습니다.
              </div>
            ) : null
          }
          scrollableTarget="scrollableDiv"
          className="flex flex-col gap-4"
        >
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              {/* 프로필 이미지 */}
              <div className="bg-brand-orange flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                {renderProfileImage(comment.author)}
              </div>

              {/* 댓글 내용 */}
              <div className="flex-1 text-sm">
                <div className="flex items-end gap-2">
                  <p className="font-bold">{comment.author?.nickname || "익명"}</p>
                  <span className="text-brand-gray-400 text-xs">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {/* 수정 모드 */}
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
                        className="text-xs text-blue-500 underline underline-offset-2 disabled:opacity-50"
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
                  /* 일반 모드 */
                  <>
                    <p className="mt-1 break-words">{comment.content}</p>
                    <div className="text-brand-gray-400 mt-2 flex justify-start gap-3.5">
                      <button
                        onClick={() => handleEditStart(comment.id, comment.content)}
                        disabled={isLoading}
                        className="text-xs underline underline-offset-2 hover:text-gray-600 disabled:opacity-50"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={isLoading}
                        className="text-xs underline underline-offset-2 hover:text-gray-600 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </InfiniteScroll>

        {/* 댓글 없음 상태 */}
        {comments.length === 0 && !isLoading && !hasMore && (
          <div className="text-brand-gray-400 py-4 text-center">아직 댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
