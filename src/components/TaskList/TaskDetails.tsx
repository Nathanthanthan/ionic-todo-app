import { IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";

export default function TaskDetails() {
  const test = useParams();

  console.log(test);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className=''>
        {/* {taskId} */}
      </div>
    </IonPage>
  );
}
