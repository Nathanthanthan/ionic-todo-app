import { useContext, useEffect, useState } from "react";
import TaskService from "../../../Services/TaskService";
import { AuthContext } from "../../../Providers/AuthProvider";

export default function useTaskService(todoId: string | undefined) {
  const uid = useContext(AuthContext).currentUser?.uid;

  const [taskService, setTaskService] = useState<TaskService>();

  useEffect(() => {
    if (uid === undefined || todoId === undefined) return;

    setTaskService(new TaskService(uid, todoId));
  }, [uid]);

  return taskService;
}
