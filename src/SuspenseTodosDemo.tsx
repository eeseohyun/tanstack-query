import { Suspense } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchTodos } from './api';
import { todoKeys } from './todoKeys';

function SuspenseTodosContent() {
  const queryClient = useQueryClient();
  const { data, isFetching, dataUpdatedAt } = useSuspenseQuery({
    queryKey: todoKeys.suspense(),
    queryFn: fetchTodos,
  });

  return (
    <div style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <p>
        Suspense 모드 데이터 개수: <b>{data.length}</b>
        <br />
        백그라운드 isFetching: <b>{String(isFetching)}</b>
        <br />
        마지막 갱신 시각: {new Date(dataUpdatedAt).toLocaleTimeString()}
      </p>

      <ul>
        {data.map((todo) => (
          <li key={todo.id}>
            [{todo.done ? 'x' : ' '}] {todo.title}
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: todoKeys.suspense() });
        }}
      >
        invalidate로 재조회
      </button>
    </div>
  );
}

export default function SuspenseTodosDemo() {
  return (
    <Suspense fallback={<p>Suspense fallback 로딩 중...</p>}>
      <SuspenseTodosContent />
    </Suspense>
  );
}
