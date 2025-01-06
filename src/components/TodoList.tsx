import { InputInputEventDetail, IonInputCustomEvent, ItemReorderEventDetail } from "@ionic/core";
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
import { useState } from "react";

import { add } from "ionicons/icons";
import { RouteComponentProps } from "react-router";
import TodoItem, { TTodoItem } from "./TodoItem";

export default function ToDoList({ match, history }: RouteComponentProps) {
  const [currentId, setCurrentId] = useState<number>(0);
  const [newItemName, setNewItemName] = useState<string | null>(null);

  const [todoItemList, setTodoItemList] = useState<TTodoItem[]>([]);

  const onNewItemFieldChange = (e: IonInputCustomEvent<InputInputEventDetail>) => {
    if (typeof e.target.value === "number" || e.target.value === undefined) return;

    setNewItemName(e.target.value);
  };

  const checkForEnterKeyPress = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const addItem = () => {
    if (!newItemName) return;

    setTodoItemList([...todoItemList, { name: newItemName, id: currentId }]);

    setCurrentId(currentId + 1);
    setNewItemName(null);
  };

  const removeItem = (itemId: number) => {
    const updatedTodoItemList = [...todoItemList];

    const index = todoItemList.findIndex(item => item.id === itemId);
    updatedTodoItemList.splice(index, 1);

    setTodoItemList(updatedTodoItemList);
  };

  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    event.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo list</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="flex justify-end pb-2">
          {/* <IonInput
            placeholder="New item..."
            value={newItemName}
            onIonInput={onNewItemFieldChange}
            onKeyDown={checkForEnterKeyPress}
          /> */}

          <IonButton onClick={() => history.push(`${match.url}/create`)}>
            <span className="flex items-center gap-1">
              <IonIcon
                icon={add}
                className="text-lg"
              />

              Add item
            </span>
          </IonButton>
        </div>

        <IonList className="rounded">
          <IonReorderGroup
            disabled={false}
            onIonItemReorder={handleReorder}
          >
            {todoItemList.length ? (
              todoItemList.map(todoItem => (
                <TodoItem
                  key={`todoList-todoItem[${todoItem.id}]`}
                  item={todoItem}
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
