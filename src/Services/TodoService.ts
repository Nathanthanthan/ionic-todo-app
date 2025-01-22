import axios from "axios";
import { fbSecret } from "../Config/firebase";
import Todo from "../Utils/Types/Todo";
import AbstractService from "./AbstractService";

const todosEndpoint = "/todos";

class TodoService implements AbstractService<Todo> {
  async create(todo: Partial<Todo>): Promise<boolean> {
    try {
      await axios.post(`${todosEndpoint}.json?auth=${fbSecret}`, todo);

      return true;
    } catch (err) {
      console.error("Error: failed to create todo", err);
    }

    return false;
  }

  async update(id: string, updatedValues: Partial<Todo>): Promise<boolean> {
    try {
      await axios.patch(`${todosEndpoint}/${id}.json?auth=${fbSecret}`, updatedValues);

      return true;
    } catch (err) {
      console.error("Error: failed to update todo", err);
    }

    return false;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await axios.delete(`${todosEndpoint}/${id}.json?auth=${fbSecret}`);

      return true;
    } catch (err) {
      console.error("Error: failed to delete todo", err);
    }

    return false;
  }

  async getByUserId(uid: string | undefined): Promise<Todo[] | undefined> {
    if (uid === undefined) return;

    try {
      const res = await axios.get(`${todosEndpoint}.json?auth=${fbSecret}&uid=${uid}`);
      const todos: Todo[] = [];

      for (const [todoId, todo] of Object.entries(res.data)) {
        todos.push({ ...todo as Todo, id: todoId, tasks: (todo as Todo).tasks ?? [] });
      }

      return todos;
    } catch (err) {
      console.error("Error: failed to get todos", err);
    }

    return;
  }
}

const todoService = new TodoService();
export default todoService;
