import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  initialCount?: number;
  increment?: number;
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  loadMoreRef: React.RefObject<HTMLElement>;
  visibleItems: T[];
  hasMore: boolean;
  resetVisibleCount: () => void;
}

/**
 * 무한스크롤을 위한 커스텀 훅
 * @param items - 전체 아이템 배열
 * @param options - 옵션 설정
 * @returns 무한스크롤에 필요한 상태와 ref
 */
export function useInfiniteScroll<T>(
  items: T[],
  options: UseInfiniteScrollOptions = {},
): UseInfiniteScrollReturn<T> {
  const { initialCount = 6, increment = 6, threshold = 1 } = options;

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const loadMoreRef = useRef<HTMLElement>(null);

  // 현재 보여줄 아이템들
  const visibleItems = items.slice(0, visibleCount);

  // 더 불러올 아이템이 있는지 확인
  const hasMore = visibleCount < items.length;

  // visibleCount 리셋 함수
  const resetVisibleCount = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => {
            const newCount = prev + increment;
            return newCount > items.length ? items.length : newCount;
          });
        }
      },
      { threshold },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [items.length, hasMore, increment, threshold]);

  // 아이템이 변경될 때 visibleCount 조정
  useEffect(() => {
    if (visibleCount > items.length && items.length > 0) {
      setVisibleCount(items.length);
    }
  }, [items.length, visibleCount]);

  return {
    visibleCount,
    setVisibleCount,
    loadMoreRef,
    visibleItems,
    hasMore,
    resetVisibleCount,
  };
}
