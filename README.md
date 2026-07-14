# React Query Devtools 테스트

TanStack Query 캐시 상태를 devtools로 눈으로 확인하기 위한 최소 예제.

## 실행 방법

```bash
npm install
npm run dev
```

터미널에 뜨는 주소(보통 http://localhost:5173)로 접속 → 화면 우하단 모양 아이콘 클릭 → devtools 패널 열림 (기본 열림 세팅).

## 확인해볼 것들

1. **fresh → stale 전환**
   처음 로드하면 쿼리가 초록색(fresh). staleTime을 10초로 짧게 설정해뒀으니, 10초 넘게 기다렸다가 devtools에서 색이 노란색(stale)로 바뀌는지 확인.

2. **invalidate 트리거**
   "추가" 버튼을 누르면 `addTodo` mutation → `onSuccess`에서 `invalidateQueries` 실행 → devtools에서 목록 쿼리가 잠깐 fetching 상태(파란색 계열)로 바뀌었다가 새 데이터로 갱신되는 흐름 확인.

3. **낙관적 업데이트 + 롤백**
   체크박스를 클릭하면 서버 응답(0.5초) 전에 UI가 먼저 바뀜(`onMutate`). devtools 콘솔(브라우저 콘솔)에서 `[API]` 로그 찍히는 시점과 화면이 바뀌는 시점의 차이를 비교해보면 낙관적 업데이트 타이밍이 체감됨.

4. **gcTime과 Inactive 쿼리**
   "컴포넌트 언마운트" 버튼을 눌러서 `TodosDemo`를 화면에서 없애면, devtools에서 해당 쿼리가 Inactive 상태로 표시됨. gcTime을 10초로 설정해뒀으니, 10초 넘게 기다리면 devtools 목록에서 쿼리 자체가 사라지는 것까지 확인 가능.

## 코드 구조

- `src/api.ts` — 0.5~0.8초 지연을 흉내낸 가짜 API (진짜 네트워크 요청처럼 fetching 상태를 관찰하기 위함)
- `src/todoKeys.ts` — Query Key Factory 패턴
- `src/queryClient.ts` — staleTime/gcTime을 짧게 설정 (실무 값이 아니라 관찰용 값)
- `src/TodosDemo.tsx` — 조회 + 추가(invalidate) + 토글(낙관적 업데이트) 데모
- `src/App.tsx` — Provider, Devtools 마운트, 언마운트 테스트용 토글
