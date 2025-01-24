import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonPopover,
  IonProgressBar,
  useIonToast
} from "@ionic/react";
import { pencil, save, trashBin } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TODOS } from "../../Utils/Constants/Routes";
import useTodoService from "../../Utils/Hooks/UseServices/UseTodoService";
import Todo, { getTodoProgress } from "../../Utils/Types/Todo";

type Props = {
  todo: Todo;
  setDeleteAlertProps: (props: { message: string; onConfirm: () => void; }) => void;
  refetchTodos: () => Promise<void>;
};

export default function TodoCard({ todo, setDeleteAlertProps, refetchTodos }: Props) {
  const progress = getTodoProgress(todo);
  const { id: todoId, name: todoName } = todo;

  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showToast] = useIonToast();

  const todoService = useTodoService();

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>(todoName);

  useEffect(() => {
    setUpdatedName(todoName);
  }, [todoName]);

  useEffect(() => {
    if (!popoverOpen) setUpdatedName(todoName);
  }, [popoverOpen]);

  async function updateName() {
    if (updatedName === "" || updatedName === todoName || todoService === undefined) return;

    const res = await todoService.update(todoId, { name: updatedName });

    if (!res) {
      showToast({
        message: "Error: failed to update todo",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    showToast({
      message: `Todo updated successfully: ${todoName} -> ${updatedName}`,
      color: "success",
      duration: 2000,
    });

    setPopoverOpen(false);
    refetchTodos();
  }

  async function deleteTodo() {
    if (todoService === undefined) return;

    const res = await todoService.delete(todoId);

    if (!res) {
      showToast({
        message: "Error: failed to delete task",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    showToast({
      message: `${todoName} deleted successfully`,
      color: "success",
      duration: 2000,
    });

    refetchTodos();
  }

  return (
    <Link to={`${TODOS}/${todoId}`}>
      <IonCard className="m-0">
        <IonCardHeader className="py-2">
          <IonCardTitle className="flex justify-between">
            <div
              id={`todoTitle[${todoId}]`}
              className="inline-flex items-center gap-4 w-fit cursor-default"
              onClick={e => {
                e.preventDefault();
                setPopoverOpen(true);
              }}
            >
              {todoName}

              <IonButton
                disabled={popoverOpen}
                size="small"
                onClick={() => setPopoverOpen(true)}
              >
                <IonIcon icon={pencil} />
              </IonButton>

              <IonPopover
                trigger={`todoTitle[${todoId}]`}
                isOpen={popoverOpen}
                className="no-backdrop"
                onIonPopoverDidPresent={() => inputRef.current !== null && inputRef.current.setFocus()}
                onIonPopoverDidDismiss={() => setPopoverOpen(false)}
              >
                <IonContent class="ion-padding">
                  <div className="flex items-center gap-2">
                    <IonInput
                      type="text"
                      ref={inputRef}

                      placeholder="Name..."
                      className="discreet"

                      value={updatedName}
                      onIonInput={e => typeof e.target.value === "string" && setUpdatedName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && updateName()}
                    />

                    <IonButton
                      disabled={updatedName === "" || updatedName === todoName}
                      size="small"
                      onClick={updateName}
                    >
                      <IonIcon icon={save} />
                    </IonButton>
                  </div>
                </IonContent>
              </IonPopover>
            </div>

            <IonButton
              size="small"
              color="danger"
              onClick={e => {
                e.preventDefault();

                setDeleteAlertProps({
                  message: `Are you sure you want to <strong>delete</strong> ${todoName}?`,
                  onConfirm: deleteTodo,
                });
              }}
            >
              <IonIcon icon={trashBin} />
            </IonButton>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent className="flex flex-col gap-1 pb-2">
          {!todo.tasks.length ? (
            "No tasks..."
          ) : (
            <>
              <span className="text-base">
                Progress:
              </span>

              <div>
                <IonProgressBar value={progress / 100} />

                {progress.toFixed(0)}%
              </div>
            </>
          )}
        </IonCardContent>
      </IonCard>
    </Link>
  );
}
