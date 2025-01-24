import axios from "axios";
import { ref, remove } from "firebase/database";
import { fbDb, fbSecret } from "../Config/firebase";
import { TASKS_ENDPOINT, TODOS_ENDPOINT } from "../Utils/Constants/Endpoints";
import Todo from "../Utils/Types/Todo";
import TaskService from "./TaskService";

export default class TodoService {
  private readonly uid: string;
  private readonly urlTrunk: string;

  constructor(uid: string) {
    this.uid = uid;
    this.urlTrunk = `${TODOS_ENDPOINT}/${uid}`;
  }

  create = async (todo: Partial<Todo>): Promise<boolean> => {
    try {
      const cleanTodo = todo;
      delete cleanTodo["id"];

      await axios.post(`${this.urlTrunk}.json?auth=${fbSecret}`, cleanTodo);

      return true;
    } catch (err) {
      console.error("Error: failed to create todo", err);
    }

    return false;
  };

  update = async (id: string, updatedValues: Partial<Todo>): Promise<boolean> => {
    try {
      const cleanTodo = updatedValues;
      delete cleanTodo["id"];

      await axios.patch(`${this.urlTrunk}/${id}.json?auth=${fbSecret}`, cleanTodo);

      return true;
    } catch (err) {
      console.error("Error: failed to update todo", err);
    }

    return false;
  };

  deletePicture = async (id: string): Promise<boolean> => {
    try {
      await remove(ref(fbDb, `${this.urlTrunk}/${id}/picture`));

      return true;
    } catch (err) {
      console.error("Error: failed to remove picture from todo", err);
    }

    return false;
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      await Promise.all([
        axios.delete(`${this.urlTrunk}/${id}.json?auth=${fbSecret}`),
        axios.delete(`${TASKS_ENDPOINT}/${this.uid}/${id}.json?auth=${fbSecret}`),
      ]);

      return true;
    } catch (err) {
      console.error("Error: failed to delete todo", err);
    }

    return false;
  };

  getCurrentUserTodos = async (): Promise<Todo[] | null> => {
    try {
      const res = await axios.get(`${this.urlTrunk}.json?auth=${fbSecret}`);

      if (res.data === null) return [];

      const todos: Todo[] = [];

      for (const [todoId, todo] of Object.entries(res.data)) {
        const taskService = new TaskService(this.uid, todoId);

        const tasks = await taskService.getTasksByTodoId(todoId);

        todos.push({ ...todo as Todo, id: todoId, tasks: tasks ?? [] });
      }

      return todos;
    } catch (err) {
      console.error("Error: failed to fetch todos", err);
    }

    return null;
  };

  getTodoById = async (todoId: string | undefined): Promise<Todo | undefined> => {
    if (todoId === undefined) return;

    try {
      const taskService = new TaskService(this.uid, todoId);

      const res = await Promise.all([
        axios.get(`${this.urlTrunk}/${todoId}.json?auth=${fbSecret}`),
        taskService.getTasksByTodoId(todoId),
      ]);

      return { ...res[0].data, id: todoId, tasks: res[1] ?? [] };
    } catch (err) {
      console.error("Error: failed to fetch todos", err);
    }

    return;
  };
}
