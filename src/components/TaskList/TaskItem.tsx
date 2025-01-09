import { IonCheckboxCustomEvent } from "@ionic/core";
import {
  CheckboxChangeEventDetail,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonReorder,
} from "@ionic/react";
import { trashBin } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { LIST } from "../../Utils/Constants/Routes";
import Task from "../../Utils/Types/Task";

type Props = Readonly<{
  task: Task;
  onDeleteBtnClick: (itemId: number) => void;
}>;

export default function TaskItem({ task, onDeleteBtnClick }: Props) {
  const history = useHistory();

  const [isChecked, setIsChecked] = useState<boolean>(false);

  function onCheckboxChange(e: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) {
    setIsChecked(e.target.checked);
  };

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption onClick={() => history.push(`${LIST}/${task.id}`)}>
          Details
        </IonItemOption>
      </IonItemOptions>

      <IonItem>
        <IonCheckbox
          justify="start"
          labelPlacement="end"
          className={isChecked ? "text-muted-foreground line-through" : undefined}
          checked={isChecked}
          onIonChange={onCheckboxChange}
        >
          {task.name}
        </IonCheckbox>

        <IonButton
          color="danger"
          onClick={() => onDeleteBtnClick(task.id)}
        >
          <IonIcon icon={trashBin} />
        </IonButton>

        <IonReorder slot="end" />
      </IonItem>
    </IonItemSliding>
  );
};
