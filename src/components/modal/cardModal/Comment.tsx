"use client";
import dayjs from "dayjs";

import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Field from "@/components/form/Field";
import Textarea from "@/components/form/Textarea";
import Button from "@/components/common/Button";
import { useColumnId } from "@/features/columns/store";
import { Comment } from "@/features/comments/types";
import { createComment, updateComment, deleteComment, getComments } from "@/features/comments/api";

export default function CommentList() {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursorId, setCursorId] = useState<number | null>(null);

  const { columnIdData } = useColumnId();
  const cardId = columnIdData?.cardId ?? 0;
  const dashboardId = columnIdData?.dashboardId ?? 0;
  const columnId = columnIdData?.columnId ?? 0;

  // 댓글 목록 불러오기
  const fetchComments = useCallback(
    async (reset = false) => {
      if (!cardId) return;

      try {
        setIsLoading(true);
        const response = await getComments(cardId, {
          size: 10,
          cursorId: reset ? undefined : (cursorId ?? undefined),
        });

        const data = "data" in (response as any) ? (response as any).data : response;
        const newComments = data?.comments || data || [];
        const nextCursor = data?.cursorId ?? null;

        setComments((prev) => (reset ? newComments : [...prev, ...newComments]));
        setCursorId(nextCursor);
        setHasMore(!!nextCursor && newComments.length > 0);
        console.log("새로운 시간", newComments);
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
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

  const fetchMore = useCallback(() => {
    if (hasMore && !isLoading && cardId) fetchComments(false);
  }, [hasMore, isLoading, cardId, fetchComments]);

  useEffect(() => {
    if (cardId) {
      setComments([]);
      setCursorId(null);
      setHasMore(true);
      fetchComments(true);
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
      const newComment = ("data" in response ? response.data : response) as Comment;
      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (error) {
      console.error("댓글 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: number) => {
    if (!editingContent.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await updateComment(commentId, { content: editingContent.trim() });
      const updated = ("data" in response ? response.data : response) as Comment;
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
      setEditingContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cardId) {
    return <div className="py-4 text-center text-gray-500">카드 정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 댓글 입력 */}
      <Field id="comment" label="댓글">
        <div className="dark:bg-dark-900 rounded-lg border border-[#D9D9D9] p-3">
          <Textarea
            placeholder="댓글 작성하기"
            className="resize-none rounded-none border-0 !p-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-1 flex justify-end">
            <Button
              color="buttonBasic"
              onClick={handleCreate}
              className="text-brand-blue-500 dark:bg-dark-700 h-8 w-20"
              disabled={!input.trim() || isLoading}
            >
              입력
            </Button>
          </div>
        </div>
      </Field>

      {/* 댓글 목록 */}
      <div className="max-h-80 overflow-y-auto" id="comments-scroll">
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<div className="py-2 text-center text-sm text-gray-500">로딩중...</div>}
          endMessage={
            comments.length > 0 && (
              <div className="py-2 text-center text-sm text-gray-400">
                모든 댓글을 불러왔습니다.
              </div>
            )
          }
          scrollableTarget="comments-scroll"
          className="space-y-4"
        >
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              {/* 프로필 */}
              <div className="bg-brand-orange flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
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

              {/* 댓글 내용 */}
              <div className="flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{comment.author?.nickname || "익명"}</span>
                  <span className="text-xs text-gray-400">
                    {dayjs(comment.createdAt).subtract(9, "hour").format("MM-DD A h:mm")}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="mt-1">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full resize-none text-sm"
                      rows={2}
                    />
                    <div className="mt-1 flex gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="text-xs text-blue-500 hover:underline"
                        disabled={!editingContent.trim()}
                      >
                        완료
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingContent("");
                        }}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1">{comment.content}</p>
                    <div className="mt-1 flex gap-2 text-xs text-gray-400">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className="hover:text-gray-600 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="hover:text-gray-600 hover:underline"
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

        {comments.length === 0 && !isLoading && (
          <div className="py-8 text-center text-gray-400">아직 댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
