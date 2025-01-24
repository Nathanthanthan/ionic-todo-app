import {
  IonAlert,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { add, logOut as logOutIcon, trashBin } from "ionicons/icons";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { TodoContext } from "../../Providers/TodoProvider";
import { getTodoProgress } from "../../Utils/Types/Todo";
import TodoCard from "./TodoCard";
import TodoCreationModal from "./TodoCreationModal";

export default function Todos() {
  const { currentUser, logOut } = useContext(AuthContext);
  const { todoService, todos, todosLoading, refetchTodos } = useContext(TodoContext);
  const [showToast] = useIonToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlertProps, setDeleteAlertProps] = useState<{ message: string; onConfirm: () => void; }>();

  const completedTodosIds = useMemo(() => {
    if (!todos) return [];

    const result = [];

    for (const t of todos) {
      if (getTodoProgress(t) === 100) result.push(t.id);
    }

    return result;
  }, [todos]);

  async function onTodoSubmit(name: string) {
    if (todoService === undefined) return;

    const res = await todoService.create({ name });

    if (res) {
      refetchTodos();
    } else {
      showToast({
        message: "Error: failed to create todo",
        color: "danger",
        duration: 2000,
      });
    }
  }

  async function deleteAllCompleted() {
    if (todoService === undefined) return;

    const res = await Promise.all(completedTodosIds.map(todoService.delete));

    for (const r of res) {
      if (r) continue;

      showToast({
        message: "Error: failed to delete task",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    showToast({
      message: "Successfully deleted all completed todos",
      color: "success",
      duration: 2000,
    });

    refetchTodos();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todos</IonTitle>

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

      {/* Todo creation */}
      <TodoCreationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={onTodoSubmit}
      />

      {/* Confirm todo deletion */}
      <IonAlert
        isOpen={deleteAlertProps !== undefined}
        onIonAlertDidDismiss={({ detail }) => {
          if (detail.role === "confirm" && deleteAlertProps !== undefined) deleteAlertProps.onConfirm();
          setDeleteAlertProps(undefined);
        }}

        header="Delete task"
        message={deleteAlertProps?.message}

        buttons={[
          {
            role: "cancel",
            text: "Cancel",
          },
          {
            role: "confirm",
            text: "Confirm",
          },
        ]}
      />

      <div className="size-full p-4">
        <div className={`flex flex-col md:flex-row pb-2 ${currentUser ? "justify-between" : "justify-end"}`}>
          {currentUser && (
            <h1 className="truncate">{currentUser.displayName}'s todo list</h1>
          )}

          <div className="inline-flex gap-2">
            <IonButton
              disabled={!completedTodosIds.length}
              color="danger"
              className="w-full md:w-fit"
              onClick={() => setDeleteAlertProps({
                message: "Are you sure you want to <strong>delete</strong> all completed todos?",
                onConfirm: deleteAllCompleted,
              })}
            >
              <span className="flex items-center gap-1">
                <IonIcon
                  icon={trashBin}
                  className="text-lg"
                />

                Delete completed
              </span>
            </IonButton>

            <IonButton
              className="w-full md:w-fit"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="flex items-center gap-1">
                <IonIcon
                  icon={add}
                  className="text-lg"
                />

                Add todo
              </span>
            </IonButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 size-full">
          {(todos === undefined || todosLoading) ? (
            <div className="flex justify-center items-center size-full">
              <IonSpinner />
            </div>
          ) : (
            todos === null ? (
              <div className="flex justify-center items-center size-full">
                <IonButton onClick={refetchTodos}>
                  Retry
                </IonButton>

                <IonToast
                  isOpen
                  message="Error: failed to fetch todos"
                  color="danger"
                  duration={2000}
                />
              </div>
            ) : (
              !todos.length ? (
                <div className="flex justify-center items-center size-full text-2xl text-muted-foreground">
                  No todos to display...
                </div>
              ) : (
                todos.map(todo => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    setDeleteAlertProps={setDeleteAlertProps}
                    refetchTodos={refetchTodos}
                  />
                ))
              )
            )
          )}
        </div>
      </div>
    </IonPage>
  );
}
