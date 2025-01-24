import { createContext } from "react";
import TodoService from "../Services/TodoService";
import useQuery from "../Utils/Hooks/UseQuery";
import useTodoService from "../Utils/Hooks/UseServices/UseTodoService";
import Todo from "../Utils/Types/Todo";

export const TodoContext = createContext<{
  todoService: TodoService | undefined;
  todos: Todo[] | null | undefined;
  todosLoading: boolean;
  refetchTodos: () => Promise<void>;
}>({
  todoService: undefined,
  todos: undefined,
  todosLoading: false,
  refetchTodos: async () => { },
});

export default function TodoProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const todoService = useTodoService();

  const { data: todos, loading: todosLoading, reRunQuery: refetchTodos } = useQuery({
    query: todoService?.getCurrentUserTodos,
    args: [],
  });

  return (
    <TodoContext.Provider value={{ todoService, todos, todosLoading, refetchTodos }}>
      {children}
    </TodoContext.Provider>
  );
}
