import { Suspense, useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTodosWithSuspenseError } from './api';
import { todoKeys } from './todoKeys';
import { ErrorBoundary } from './ErrorBoundary';

function SuspenseWithErrorContent({ shouldError }: { shouldError: boolean }) {
  const queryClient = useQueryClient();

  const { data, isFetching } = useSuspenseQuery({
    queryKey: todoKeys.suspenseError(shouldError),
    queryFn: () => fetchTodosWithSuspenseError(shouldError),
  });

  return (
    <div style={{ maxWidth: 520, lineHeight: 1.6 }}>
      <div
        style={{
          padding: 12,
          backgroundColor: shouldError ? '#fee' : '#efe',
          border: `1px solid ${shouldError ? '#fcc' : '#cfc'}`,
          borderRadius: 4,
          marginBottom: 12,
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {shouldError ? '❌ 에러 시뮬레이션 ON' : '✅ 정상 모드'}
        </p>
      </div>

      <p>
        백그라운드 isFetching: <b>{String(isFetching)}</b>
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
          queryClient.invalidateQueries({
            queryKey: todoKeys.suspenseError(!shouldError),
          });
        }}
      >
        {shouldError ? '정상 모드로 전환' : '에러 모드로 전환'}
      </button>
    </div>
  );
}

export default function SuspenseWithErrorDemo() {
  const [shouldError, setShouldError] = useState(false);

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={shouldError}
            onChange={(e) => setShouldError(e.target.checked)}
          />
          에러 발생 토글
        </label>
        <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0 0' }}>
          토글을 변경하면 쿼리가 재실행됩니다. 에러 모드에서 에러가 ErrorBoundary로
          캐치되는 흐름을 관찰하세요.
        </p>
      </div>

      <ErrorBoundary
        fallback={(error, reset) => (
          <div
            style={{
              padding: 16,
              backgroundColor: '#fee',
              border: '2px solid #c33',
              borderRadius: 4,
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#c33' }}>
              🚨 Suspense 에러 캐치됨
            </h3>
            <p style={{ margin: '0 0 12px 0', color: '#666' }}>
              {error.message}
            </p>
            <button
              onClick={() => {
                reset();
                setShouldError(false);
              }}
            >
              정상 모드로 복구
            </button>
          </div>
        )}
      >
        <Suspense fallback={<p>Suspense: 로딩 중...</p>}>
          <SuspenseWithErrorContent shouldError={shouldError} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
