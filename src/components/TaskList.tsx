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
import TaskItem from "./TaskItem";
import TaskCreationModal from "./TaskCreationModal";

export default function TaskList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentId, setCurrentId] = useState<number>(0);
  const [taskList, setTaskList] = useState<Task[]>([]);

  function onTaskSubmit(taskName: string) {
    setTaskList([...taskList, { id: currentId, name: taskName, index: currentId, checked: false }]);
    setCurrentId(currentId + 1);
  }

  function removeItem(itemId: number) {
    const updatedTaskList = [...taskList];

    const index = taskList.findIndex(item => item.id === itemId);
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
                  onDeleteBtnClick={removeItem}
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
