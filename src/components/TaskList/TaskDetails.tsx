import { IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

type Props = Readonly<{
  id: number;
}>;

export default function TaskDetails({ id }: Props) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className=''>
        {id}
      </div>
    </IonPage>
  );
}
