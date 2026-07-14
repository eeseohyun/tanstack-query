import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, addTodo, toggleTodo, type Todo } from './api';
import { todoKeys } from './todoKeys';

export default function TodosDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const {
    data: todos,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos,
  });

  // 추가: 성공 후 invalidate → devtools에서 목록 쿼리가 다시 fetching 되는 걸 확인
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  // 토글: 낙관적 업데이트 → 실패 시 롤백 패턴
  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });
      const previous = queryClient.getQueryData<Todo[]>(todoKeys.lists());
      queryClient.setQueryData<Todo[]>(todoKeys.lists(), (old) =>
        old?.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(todoKeys.lists(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <p>
        isFetching: <b>{String(isFetching)}</b>
        <br />
        마지막 갱신 시각: {new Date(dataUpdatedAt).toLocaleTimeString()}
      </p>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleMutation.mutate(todo.id)}
              />
              {todo.title}
            </label>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 할일"
        />
        <button
          disabled={!title}
          onClick={() => {
            addMutation.mutate(title);
            setTitle('');
          }}
        >
          추가 (invalidate 트리거)
        </button>
      </div>

      <hr style={{ margin: '16px 0' }} />
      <p style={{ fontSize: 13, color: '#555' }}>
        staleTime 10초 / gcTime 10초로 짧게 설정해둠. 아래 "컴포넌트 언마운트"
        버튼으로 이 컴포넌트를 없앤 뒤 devtools의 Inactive 쿼리가 10초 뒤
        사라지는 것까지 관찰해보기 (App.tsx에서 토글).
      </p>
    </div>
  );
}
