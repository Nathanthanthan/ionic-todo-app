import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonPopover,
  IonProgressBar,
  useIonToast
} from "@ionic/react";
import { camera, image, pencil, save, trashBin } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TodoService from "../../Services/TodoService";
import { TODOS } from "../../Utils/Constants/Routes";
import Todo, { getTodoProgress } from "../../Utils/Types/Todo";

type Props = {
  todo: Todo;
  todoService: TodoService | undefined;
  takePicture: () => Promise<string | undefined>;
  selectFromGallery: () => Promise<string | undefined>;
  setDeleteAlertProps: (props: { message: string; onConfirm: () => void; }) => void;
  refetchTodos: () => Promise<void>;
};

export default function TodoCard({
  todo,
  todoService,
  takePicture,
  selectFromGallery,
  setDeleteAlertProps,
  refetchTodos,
}: Props) {
  const progress = getTodoProgress(todo);
  const { id: todoId, name: todoName } = todo;

  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showToast] = useIonToast();

  const [isNamePopoverOpen, setIsNamePopoverOpen] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>(todoName);

  const [picPopoverState, setPicPopoverState] = useState<{ content: JSX.Element, className: string }>();

  useEffect(() => {
    setUpdatedName(todoName);
  }, [todoName]);

  useEffect(() => {
    if (!isNamePopoverOpen) setUpdatedName(todoName);
  }, [isNamePopoverOpen]);

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

    setIsNamePopoverOpen(false);
    refetchTodos();
  }

  async function updatePicture(pictureCallback: () => Promise<string | undefined>) {
    if (todoService === undefined) return;

    const base64 = await pictureCallback();

    if (base64 === undefined) {
      showToast({
        message: "Error: failed to upload picture",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    const res = await todoService.update(todoId, { picture: base64 });

    if (!res) {
      showToast({
        message: "Error: failed to update todo",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    showToast({
      message: `Todo updated successfully: added picture`,
      color: "success",
      duration: 2000,
    });

    setPicPopoverState(undefined);
    refetchTodos();
  }

  async function deletePicture() {
    if (todoService === undefined) return;

    const res = await todoService.deletePicture(todoId);

    if (!res) {
      showToast({
        message: "Error: failed to remove picture from todo",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    showToast({
      message: `Todo updated successfully: removed picture`,
      color: "success",
      duration: 2000,
    });

    setPicPopoverState(undefined);
    refetchTodos();
  }

  async function deleteTodo() {
    if (todoService === undefined) return;

    const res = await todoService.delete(todoId);

    if (!res) {
      showToast({
        message: "Error: failed to delete todo",
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

  function renderPictureSourceOptions(narrowToWide = false) {
    setPicPopoverState({
      content: (
        <>
          <IonButton
            size="small"
            color="secondary"
            onClick={() => updatePicture(takePicture)}
          >
            <IonIcon icon={camera} className="mr-2" />

            Camera
          </IonButton>

          <IonButton
            size="small"
            color="secondary"
            onClick={() => updatePicture(selectFromGallery)}
          >
            <IonIcon icon={image} className="mr-2" />

            Gallery
          </IonButton>
        </>
      ),
      className: `wide${narrowToWide ? " narrow-to-wide" : ""}`,
    });
  }

  return (
    <Link to={`${TODOS}/${todoId}`}>
      <IonCard className="flex m-0">
        <div className="w-full">
          <IonCardHeader className="py-2">
            <IonCardTitle className="flex justify-between">
              <div
                id={`todoTitle[${todoId}]`}
                className="inline-flex items-center gap-4 w-fit cursor-default"
                onClick={e => {
                  e.preventDefault();
                  setIsNamePopoverOpen(true);
                }}
              >
                {todoName}

                <IonButton
                  disabled={isNamePopoverOpen}
                  size="small"
                  onClick={() => setIsNamePopoverOpen(true)}
                >
                  <IonIcon icon={pencil} />
                </IonButton>

                <IonPopover
                  trigger={`todoTitle[${todoId}]`}
                  isOpen={isNamePopoverOpen}
                  className="no-backdrop"
                  onIonPopoverDidPresent={() => inputRef.current !== null && inputRef.current.setFocus()}
                  onIonPopoverDidDismiss={() => setIsNamePopoverOpen(false)}
                >
                  <IonContent class="ion-padding">
                    <div className="flex justify-center items-center gap-2">
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
        </div>

        <div
          className="inline-flex items-center gap-2 p-4 pl-0"
          onClick={e => e.preventDefault()}
        >
          {todo.picture === undefined ? (
            <IonButton
              id={`todoPicture[${todoId}]`}
              size="small"
              color="secondary"
              onClick={() => renderPictureSourceOptions()}
            >
              <IonIcon icon={image} />
            </IonButton>
          ) : (
            <button
              onClick={() => setPicPopoverState({
                content: (
                  <>
                    <IonButton
                      size="small"
                      onClick={() => renderPictureSourceOptions(true)}
                    >
                      <IonIcon icon={pencil} />
                    </IonButton>

                    <IonButton
                      size="small"
                      color="danger"
                      onClick={deletePicture}
                    >
                      <IonIcon icon={trashBin} />
                    </IonButton>
                  </>
                ),
                className: "narrow",
              })}
            >
              <IonImg
                id={`todoPicture[${todoId}]`}
                src={todo.picture}
                alt={`Todo "${todo.name}" picture`}
                className="size-20"
              />
            </button>
          )}

          <IonPopover
            trigger={`todoPicture[${todoId}]`}
            isOpen={picPopoverState !== undefined}
            alignment="end"
            size="auto"
            className={`no-backdrop${picPopoverState !== undefined ? ` ${picPopoverState.className}` : ""}`}
            onIonPopoverDidDismiss={() => setPicPopoverState(undefined)}
          >
            <IonContent class="ion-padding">
              <div className="flex justify-center items-center gap-2 w-fit">
                {picPopoverState?.content}
              </div>
            </IonContent>
          </IonPopover>

          <IonButton
            size="small"
            color="danger"
            className="h-fit"
            onClick={() => {
              setDeleteAlertProps({
                message: `Are you sure you want to <strong>delete</strong> ${todoName}?`,
                onConfirm: deleteTodo,
              });
            }}
          >
            <IonIcon icon={trashBin} />
          </IonButton>
        </div>
      </IonCard>
    </Link>
  );
}
