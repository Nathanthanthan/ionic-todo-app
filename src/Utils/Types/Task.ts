type Task = {
  todoId: string;
  id: string;
  name: string;
  index: number;
  checked: boolean;

  subTasks?: SubTask[];
};

type SubTask = Task & {
  taskId: string;
};

export type { Task, SubTask };
