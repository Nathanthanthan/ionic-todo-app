import { Task } from "./Task";

type Todo = {
  uid: string;
  id: string;
  name: string;
  index: number;

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

    if (currentTask.checked) {
      checkedTasks++;

      i++;
      continue;
    }

    checkedTasks += getTaskProgress(currentTask) / 100;

    i++;
  }

  return (checkedTasks * 100) / tasksLength;
}

function getTaskProgress(task: Task): number {
  const subTasks = task.subTasks;

  if (subTasks === undefined) return 0;

  const subTasksLength = subTasks.length;

  if (!subTasksLength) return 0;

  let checkedTasks = 0;

  let i = 0;

  while (i < subTasksLength) {
    const currentSubTask = subTasks[i];

    if (currentSubTask.checked) {
      checkedTasks++;

      i++;
      continue;
    }

    checkedTasks += getTaskProgress(currentSubTask) / 100;

    i++;
  }

  return (checkedTasks * 100) / subTasksLength;
}

export default Todo;
