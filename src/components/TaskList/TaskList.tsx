import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonToast,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { add, logOut as logOutIcon } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { TodoContext } from "../../Providers/TodoProvider";
import useQuery from "../../Utils/Hooks/UseQuery";
import useTaskService from "../../Utils/Hooks/UseServices/UseTaskService";
import { getTodoProgress } from "../../Utils/Types/Todo";
import TaskCreationModal from "./TaskCreationModal";
import TaskItem from "./TaskItem";

export default function TaskList({ match }: RouteComponentProps<{ todoId: string; }>) {
  const { todoId } = match.params;

  const [showToast] = useIonToast();

  const { todoService, refetchTodos } = useContext(TodoContext);
  const { currentUser, logOut } = useContext(AuthContext);

  const taskService = useTaskService(todoId);

  const { data: todo, loading: _, reRunQuery: refetchTodo } = useQuery({
    query: todoService?.getTodoById,
    args: [todoId],
  });

  const { data: tasks, loading: tasksLoading, reRunQuery: refetchTasks } = useQuery({
    query: taskService?.getTasksByTodoId,
    args: [todoId],
  });

  const [todoProgress, setTodoProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (todo !== undefined) setTodoProgress(getTodoProgress(todo));
  }, [todo]);

  async function onTaskSubmit(name: string) {
    if (taskService === undefined || !currentUser) return;

    const res = await taskService.create({ name });

    if (res) {
      refetchTodos();
      refetchTodo();
      refetchTasks();
    } else {
      showToast({
        message: "Error: failed to create task",
        color: "danger",
        duration: 2000,
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton
              className="pr-5"
              onClick={logOut}
            >
              Logout

              <IonIcon
                slot="end"
                icon={logOutIcon}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Task creation/edition */}
      <TaskCreationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={onTaskSubmit}
      />

      <div className="size-full p-4">
        <div className="flex justify-end items-center gap-4 pb-2">
          {todo && (
            <>
              <h1 className="shrink-0">{todo.name}</h1>

              <div className="inline-flex flex-col gap-0.5 w-full">
                {todoProgress.toFixed(0)}%

                <IonProgressBar value={todoProgress / 100} />
              </div>
            </>
          )}

          <IonButton className="shrink-0" onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-1">
              <IonIcon
                icon={add}
                className="text-lg"
              />

              Add task
            </span>
          </IonButton>
        </div>

        <IonList className="rounded">
          {(tasks === undefined || tasksLoading) ? (
            <div className="flex justify-center items-center size-full">
              <IonSpinner />
            </div>
          ) : (
            tasks === null ? (
              <div className="flex justify-center items-center size-full">
                <IonButton onClick={refetchTasks}>
                  Retry
                </IonButton>

                <IonToast
                  isOpen
                  message="Error: failed to fetch tasks"
                  color="danger"
                  duration={2000}
                />
              </div>
            ) : (
              tasks.length ? (
                tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    todoId={todoId}
                    task={task}
                    refetchTodos={refetchTodos}
                    refetchTodo={refetchTodo}
                    refetchTasks={refetchTasks}
                  />
                ))
              ) : (
                <span className="flex justify-center w-full py-2 text-2xl text-muted-foreground">
                  No tasks to display...
                </span>
              )
            )
          )}
        </IonList>
      </div>
    </IonPage>
  );
};
