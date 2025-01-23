import { useContext, useEffect, useState } from "react";
import TodoService from "../../../Services/TodoService";
import { AuthContext } from "../../../Providers/AuthProvider";

export default function useTodoService() {
  const uid = useContext(AuthContext).currentUser?.uid;

  const [todoService, setTodoService] = useState<TodoService>();

  useEffect(() => {
    if (uid === undefined) return;

    setTodoService(new TodoService(uid));
  }, [uid]);

  return todoService;
}
