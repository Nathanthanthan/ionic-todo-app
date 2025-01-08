type Task = {
  id: number;
  name: string;
  index: number;
  checked: boolean;

  subTasks?: Task[];
};

export default Task;
