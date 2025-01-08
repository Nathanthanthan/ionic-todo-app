type TTodoItem = {
  id: number;
  name: string;
  index: number;
  checked: boolean;

  subTasks?: TTodoItem[];
};

export default TTodoItem;
