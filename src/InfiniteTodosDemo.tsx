import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchTodosPage } from './api';
import { todoKeys } from './todoKeys';

export default function InfiniteTodosDemo() {
  const { ref, inView } = useInView({ threshold: 0.7 });

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: todoKeys.infinite(),
    queryFn: ({ pageParam }) => fetchTodosPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <p>첫 페이지 로딩 중...</p>;

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div style={{ maxWidth: 520, lineHeight: 1.6 }}>
      <p>
        전체 아이템: <b>{items.length}</b>
        <br />
        isFetching: <b>{String(isFetching)}</b>
      </p>

      <ul>
        {items.map((todo) => (
          <li key={todo.id}>
            [{todo.done ? 'x' : ' '}] {todo.title}
          </li>
        ))}
      </ul>

      <div ref={ref} style={{ height: 12 }} />

      {isFetchingNextPage && <p>다음 페이지 가져오는 중...</p>}
      {!hasNextPage && <p>마지막 페이지까지 모두 불러왔습니다.</p>}

      <button
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        수동으로 다음 페이지 불러오기
      </button>
    </div>
  );
}
