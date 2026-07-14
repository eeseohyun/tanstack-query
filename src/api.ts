export type Todo = {
  id: number
  title: string
  done: boolean
}

let todos: Todo[] = [
  { id: 1, title: 'React Query 개념 정리하기', done: false },
  { id: 2, title: '블로그 글 작성하기', done: false },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchTodos(): Promise<Todo[]> {
  console.log('[API] fetchTodos 호출됨:', new Date().toLocaleTimeString())
  await delay(800)
  return [...todos]
}

export async function addTodo(title: string): Promise<Todo> {
  await delay(800)
  const newTodo: Todo = { id: Date.now(), title, done: false }
  todos = [...todos, newTodo]
  return newTodo
}

export async function toggleTodo(id: number): Promise<Todo> {
  await delay(500)
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  return todos.find((t) => t.id === id)!
}
