import {
  IonAlert,
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPopover,
  useIonToast,
} from "@ionic/react";
import { pencil, save, trashBin } from "ionicons/icons";
import { useRef, useState } from "react";
import useTaskService from "../../Utils/Hooks/UseServices/UseTaskService";
import Task from "../../Utils/Types/Task";

type Props = Readonly<{
  todoId: string | undefined;
  task: Task;
  refetchTodos: () => Promise<void>;
  refetchTodo: () => Promise<void>;
  refetchTasks: () => Promise<void>;
}>;

export default function TaskItem({ todoId, task, refetchTodos, refetchTodo, refetchTasks }: Props) {
  const { id: taskId, name: taskName, checked } = task;

  const inputRef = useRef<HTMLIonInputElement>(null);
  const [showToast] = useIonToast();

  const taskService = useTaskService(todoId);

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>(task.name);

  async function updateName() {
    if (updatedName === "" || updatedName === taskName || taskService === undefined) return;

    const res = await taskService.update(taskId, { name: updatedName });

    if (!res) {
      showToast({
        message: "Error: failed to update task",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    refetchTasks();

    showToast({
      message: `Task updated successfully: ${taskName} -> ${updatedName}`,
      color: "success",
      duration: 2000,
    });

    setPopoverOpen(false);
  }

  async function updateChecked() {
    if (taskService === undefined) return;

    const res = await taskService.update(taskId, { checked: !checked });

    if (!res) {
      showToast({
        message: "Error: failed to update task",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    refetchTodos();
    refetchTodo();
    refetchTasks();
  }

  async function deleteTask() {
    if (taskService === undefined) return;

    const res = await taskService.delete(taskId);

    if (!res) {
      showToast({
        message: "Error: failed to delete task",
        color: "danger",
        duration: 2000,
      });

      return;
    }

    refetchTodos();
    refetchTodo();
    refetchTasks();
  }

  return (
    <IonItem onClick={updateChecked}>
      <div
        className="inline-flex gap-4"
        onClick={e => e.stopPropagation()}
      >
        <IonCheckbox
          justify="start"
          labelPlacement="end"
          className={checked ? "text-muted-foreground line-through" : undefined}
          checked={checked}
          onIonChange={updateChecked}
        />

        <div
          id={`editTaskButton[${taskId}]`}
          className={
            "inline-flex justify-start items-center gap-4 select-none"
            + (checked ? " text-muted-foreground line-through" : "")
          }
        >
          {task.name}

          <IonButton
            disabled={popoverOpen}
            size="small"
            onClick={() => setPopoverOpen(true)}
          >
            <IonIcon icon={pencil} />
          </IonButton>
        </div>
      </div>

      <IonPopover
        trigger={`editTaskButton[${taskId}]`}
        isOpen={popoverOpen}
        className="no-backdrop"
        onIonPopoverDidPresent={() => inputRef.current !== null && inputRef.current.setFocus()}
        onIonPopoverDidDismiss={() => setPopoverOpen(false)}
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
              disabled={updatedName === "" || updatedName === taskName}
              size="small"
              onClick={updateName}
            >
              <IonIcon icon={save} />
            </IonButton>
          </div>
        </IonContent>
      </IonPopover>

      <IonButton
        id={`deleteTaskButton[${taskId}]`}
        slot="end"
        color="danger"
        onClick={e => e.stopPropagation()}
      >
        <IonIcon icon={trashBin} />
      </IonButton>

      {/* Confirm task deletion */}
      <IonAlert
        trigger={`deleteTaskButton[${taskId}]`}
        onIonAlertDidDismiss={({ detail }) => detail.role === "confirm" && deleteTask()}

        header="Delete task"
        message={`Are you sure you want to <strong>delete</strong> ${task.name}?`}

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
        onClick={e => e.stopPropagation()}
      />
    </IonItem>
  );
};
