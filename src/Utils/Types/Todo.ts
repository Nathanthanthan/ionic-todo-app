import Task from "./Task";

type Todo = {
  id: string;
  name: string;
  picture?: string;

  tasks: Task[];
};

/**
 * @param todo The `Todo` object to get the progress of.
 * @returns The percentage of checked tasks of the provided todo.
 */
export function getTodoProgress(todo: Todo): number {
  const tasks = todo.tasks;
  const tasksLength = tasks.length;

  if (!tasksLength) return 0;

  let checkedTasks = 0;

  let i = 0;

  while (i < tasksLength) {
    const currentTask = tasks[i];

    if (currentTask.checked) checkedTasks++;

    i++;
  }

  return (checkedTasks * 100) / tasksLength;
}

export default Todo;
