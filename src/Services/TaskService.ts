import axios from "axios";
import { fbSecret } from "../Config/firebase";
import { TASKS_ENDPOINT } from "../Utils/Constants/Endpoints";
import Task from "../Utils/Types/Task";

export default class TaskService {
  private readonly uid: string;
  private readonly urlTrunk: string;

  constructor(uid: string, todoId: string) {
    this.uid = uid;
    this.urlTrunk = `${TASKS_ENDPOINT}/${uid}/${todoId}`;
  }

  create = async (task: Partial<Task>): Promise<boolean> => {
    try {
      const cleanTask = task;
      delete cleanTask["id"];

      await axios.post(`${this.urlTrunk}.json?auth=${fbSecret}`, cleanTask);

      return true;
    } catch (err) {
      console.error("Error: failed to create task", err);
    }

    return false;
  };

  update = async (id: string, updatedValues: Partial<Task>): Promise<boolean> => {
    try {
      const cleanTask = updatedValues;
      delete cleanTask["id"];

      await axios.patch(`${this.urlTrunk}/${id}.json?auth=${fbSecret}`, cleanTask);

      return true;
    } catch (err) {
      console.error("Error: failed to update task", err);
    }

    return false;
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${this.urlTrunk}/${id}.json?auth=${fbSecret}`);

      return true;
    } catch (err) {
      console.error("Error: failed to delete task", err);
    }

    return false;
  };

  getTasksByTodoId = async (todoId: string | undefined): Promise<Task[] | null> => {
    if (todoId === undefined) return null;

    try {
      const res = await axios.get(`${TASKS_ENDPOINT}/${this.uid}/${todoId}.json?auth=${fbSecret}`);

      if (res.data === null) return [];

      const tasks: Task[] = [];

      for (const [taskId, task] of Object.entries(res.data)) {
        tasks.push({ ...task as Task, id: taskId });
      }

      return tasks;
    } catch (err) {
      console.error("Error: failed to fetch tasks", err);
    }

    return null;
  };
}
