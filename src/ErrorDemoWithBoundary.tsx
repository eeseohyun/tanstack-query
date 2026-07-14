import { useQuery } from '@tanstack/react-query';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { fetchTodosWithError } from './api';
import { todoKeys } from './todoKeys';
import { ErrorBoundary } from './ErrorBoundary';

function ErrorDemoContent() {
  const { reset } = useQueryErrorResetBoundary();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: todoKeys.error(),
    queryFn: fetchTodosWithError,
    retry: 1,
  });

  if (isLoading) return <p>에러 데모 로드 중...</p>;

  return (
    <div style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <p>
        이 컴포넌트는 의도적으로 에러를 발생시킵니다.
      </p>

      {error ? (
        <div
          style={{
            padding: 12,
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 4,
            marginBottom: 12,
          }}
        >
          <p style={{ margin: '0 0 8px 0', color: '#c33', fontWeight: 'bold' }}>
            ❌ 쿼리 에러: {error.message}
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#666' }}>
            retry 1회 후 실패. devtools에서 Error 상태를 확인할 수 있습니다.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => refetch()}>재시도 (refetch)</button>
            <button onClick={reset}>리셋 (queryErrorResetBoundary)</button>
          </div>
        </div>
      ) : (
        <div>
          <p>✅ 데이터 로드 성공</p>
          <ul>
            {data?.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ErrorDemoWithBoundary() {
  return (
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
            🚨 ErrorBoundary 캐치
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: 13 }}>
            {error.message}
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: 12, color: '#999' }}>
            Suspense throwError 또는 렌더링 중 에러가 발생하면 여기서 캐치됩니다.
          </p>
          <button onClick={reset}>ErrorBoundary 리셋</button>
        </div>
      )}
    >
      <ErrorDemoContent />
    </ErrorBoundary>
  );
}
