import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10초 - 이 시간이 지나면 devtools에서 fresh(초록) → stale(노랑)으로 바뀌는 게 보임
      gcTime: 1000 * 10, // 10초 - 언마운트 후 이 시간이 지나면 캐시가 사라짐 (Inactive 탭에서 확인)
    },
  },
});
