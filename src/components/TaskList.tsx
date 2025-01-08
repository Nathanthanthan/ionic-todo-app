import { ItemReorderEventDetail } from "@ionic/core";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useState } from "react";
import Task from "../Utils/Types/Task";
import ConfirmationModal from "./Common/ConfirmationModal";
import TaskCreationModal from "./TaskCreationModal";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentId, setCurrentId] = useState<number>(0);
  const [taskList, setTaskList] = useState<Task[]>([]);

  const [taskToDeleteId, setTaskToDeleteId] = useState<number>();

  function onTaskSubmit(taskName: string) {
    setTaskList([...taskList, { id: currentId, name: taskName, index: currentId, checked: false }]);
    setCurrentId(currentId + 1);
  }

  function deleteTask() {
    if (taskToDeleteId === undefined) return;

    const updatedTaskList = [...taskList];

    const index = taskList.findIndex(item => item.id === taskToDeleteId);
    updatedTaskList.splice(index, 1);

    setTaskList(updatedTaskList);
  };

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    event.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task list</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Confirm task deletion */}
      <ConfirmationModal
        isOpen={taskToDeleteId !== undefined}
        closeModal={() => setTaskToDeleteId(undefined)}

        title="Delete task"
        content={<>Are you sure you want to <strong>delete</strong> this task?</>}

        onCancel={() => setTaskToDeleteId(undefined)}
        onConfirm={deleteTask}
      />

      {/* Task creation/edition */}
      <TaskCreationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={onTaskSubmit}
      />

      <IonContent className="ion-padding">
        <div className="flex justify-end pb-2">
          <IonButton onClick={() => setIsModalOpen(true)}>
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
          <IonReorderGroup
            disabled={false}
            onIonItemReorder={handleReorder}
          >
            {taskList.length ? (
              taskList.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDeleteBtnClick={setTaskToDeleteId}
                />
              ))
            ) : (
              <h2 className="flex justify-center w-full py-2 text-muted-foreground">
                No items to display...
              </h2>
            )}
          </IonReorderGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
