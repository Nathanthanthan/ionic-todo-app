import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { z } from "zod";
import useForm from "../Utils/Hooks/UseForm";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
});

export default function TodoItemCreation() {
  const { formValues, editField, errors, submitForm } = useForm(formSchema, { name: "" });

  function onSubmitionSuccess() {
    alert("Test");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task creation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={submitForm(onSubmitionSuccess)}>
          <IonItem>
            <IonLabel position="floating">Titre</IonLabel>

            <IonInput
              placeholder="New item..."
              value={formValues.name}
              name="name"
              onIonInput={e => typeof e.target.value !== "number" && editField("name", e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
            />

            {errors?.name && (
              <IonNote color="danger">
                {errors.name._errors[0]}
              </IonNote>
            )}
          </IonItem>

          <IonButton
            type="submit"
            expand="block"
            disabled={errors !== undefined}
          >
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
