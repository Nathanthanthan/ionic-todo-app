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
  useIonToast,
} from "@ionic/react";
import { pencil, save } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import todoService from "../../Services/TodoService";
import Todo, { getTodoProgress } from "../../Utils/Types/Todo";

type Props = {
  todo: Todo;
  onClick: () => void;
  refetchTodos: () => void;
};

export default function TodoCard({ todo, onClick, refetchTodos }: Props) {
  const progress = getTodoProgress(todo);
  const todoName = todo.name;

  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showToast] = useIonToast();

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>(todoName);

  useEffect(() => {
    setUpdatedName(todoName);
  }, [todoName]);

  useEffect(() => {
    if (!popoverOpen) setUpdatedName(todoName);
  }, [popoverOpen]);

  async function updateName() {
    if (updatedName === "" || updatedName === todoName) return;

    const res = await todoService.update(todo.id, { name: updatedName });

    if (!res) return;

    showToast({
      message: `Todo updated successfully: ${todoName} -> ${updatedName}`,
      duration: 2000,
      color: "success",
    });

    setPopoverOpen(false);
    refetchTodos();
  }

  return (
    <button
      key={todo.id}
      className="text-left w-full m-1.5"
      onClick={onClick}
    >
      <IonCard className="m-0">
        <IonCardHeader className="py-2">
          <IonCardTitle
            id={`todoName[${todo.id}]`}
            className="flex items-center gap-4 w-fit cursor-default"
            onClick={e => {
              e.stopPropagation();
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
              trigger={`todoName[${todo.id}]`}
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

                {progress}%
              </div>
            </>
          )}
        </IonCardContent>
      </IonCard>
    </button>
  );
}
