import { IonCheckboxCustomEvent } from "@ionic/core";
import { CheckboxChangeEventDetail, IonButton, IonCheckbox, IonIcon, IonItem, IonReorder } from "@ionic/react";
import { useState } from "react";
import { trashBin } from "ionicons/icons";
import { TTodoItem } from "../Utils/Types";

type TProps = Readonly<{
  item: TTodoItem;
  onDeleteBtnClick: (itemId: number) => void;
}>;

export default function TodoItem({ item, onDeleteBtnClick }: TProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const onCheckboxChange = (e: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <IonItem>
      <IonCheckbox
        justify="start"
        labelPlacement="end"
        className={isChecked ? "text-muted-foreground line-through" : undefined}
        checked={isChecked}
        onIonChange={onCheckboxChange}
      >
        {item.name}
      </IonCheckbox>

      <IonButton
        color="danger"
        onClick={() => onDeleteBtnClick(item.id)}
      >
        <IonIcon icon={trashBin} />
      </IonButton>

      <IonReorder slot="end" />
    </IonItem>
  );
};
