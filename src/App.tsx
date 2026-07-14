import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';
import TodosDemo from './TodosDemo';
import InfiniteTodosDemo from './InfiniteTodosDemo';
import SuspenseTodosDemo from './SuspenseTodosDemo';
import ErrorDemoWithBoundary from './ErrorDemoWithBoundary';

type DemoMode = 'basic' | 'infinite' | 'suspense' | 'error';

export default function App() {
  const [showDemo, setShowDemo] = useState(true);
  const [mode, setMode] = useState<DemoMode>('basic');

  const renderDemo = () => {
    if (!showDemo) return null;
    if (mode === 'infinite') return <InfiniteTodosDemo />;
    if (mode === 'suspense') return <SuspenseTodosDemo />;
    if (mode === 'error') return <ErrorDemoWithBoundary />;
    return <TodosDemo />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1>React Query Devtools 테스트</h1>
        <p>
          화면 우하단의 아이콘을 누르면 devtools 패널이 열림. 쿼리 하나를
          클릭하면 상태(fresh / stale / fetching / inactive)와 데이터를
          실시간으로 볼 수 있음.
        </p>

        <button onClick={() => setShowDemo((v) => !v)}>
          {showDemo ? '컴포넌트 언마운트' : '마운트'}
        </button>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button disabled={mode === 'basic'} onClick={() => setMode('basic')}>
            기본
          </button>
          <button
            disabled={mode === 'infinite'}
            onClick={() => setMode('infinite')}
          >
            무한스크롤
          </button>
          <button
            disabled={mode === 'suspense'}
            onClick={() => setMode('suspense')}
          >
            Suspense
          </button>
          <button
            disabled={mode === 'error'}
            onClick={() => setMode('error')}
          >
            에러 처리
          </button>
        </div>

        <div style={{ marginTop: 16 }}>{renderDemo()}</div>
      </div>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
