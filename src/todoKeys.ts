export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  infinite: () => [...todoKeys.all, 'infinite'] as const,
  suspense: () => [...todoKeys.all, 'suspense'] as const,
  suspenseError: (shouldError: boolean) =>
    [...todoKeys.all, 'suspense-error', shouldError] as const,
  detail: (id: number) => [...todoKeys.all, 'detail', id] as const,
};
