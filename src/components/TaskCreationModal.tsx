import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import useForm from "../Utils/Hooks/UseForm";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
});

type TProps = Readonly<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (taskName: string) => void;
}>;

export default function TaskCreationModal({ isOpen, setIsOpen, onSubmit }: TProps) {
  const [didPresent, setDidPresent] = useState<boolean>(false);

  function onClose() {
    setIsOpen(false);
    setDidPresent(false);
  }

  return (
    <IonModal
      isOpen={isOpen}
      onIonModalDidDismiss={onClose}
      onDidPresent={() => setDidPresent(true)}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add task</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <TaskCreationModalContent
          didPresent={didPresent}
          setIsOpen={setIsOpen}
          onSubmit={onSubmit}
        />
      </IonContent>
    </IonModal>
  );
}

type TContentProps = Readonly<{
  didPresent: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (taskName: string) => void;
}>;

function TaskCreationModalContent({ setIsOpen, onSubmit, didPresent }: TContentProps) {
  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    if (didPresent && inputRef.current !== null) inputRef.current.setFocus();
  }, [didPresent]);

  const { formValues, editField, errors, submitForm } = useForm(formSchema);

  function onSubmitionSuccess() {
    if (formValues.name === undefined) return;

    onSubmit(formValues.name);
    setIsOpen(false);
  }

  return (
    <form
      className="flex flex-col gap-10 justify-center size-full"
      onSubmit={submitForm(onSubmitionSuccess)}
    >
      <IonItem>
        <IonInput
          type="text"
          ref={inputRef}

          label="Name"
          labelPlacement="floating"
          placeholder="New task..."

          value={formValues.name}
          onIonInput={e => typeof e.target.value !== "number" && editField("name", e.target.value)}
          onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
        />

        {errors?.name && (
          <IonNote color="danger" slot="end">
            {errors.name._errors[0]}
          </IonNote>
        )}
      </IonItem>

      <div className="flex">
        <IonButton
          className="flex-1"
          color="danger"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </IonButton>

        <IonButton
          type="submit"
          disabled={errors !== undefined}
          className="flex-1"
        >
          Submit
        </IonButton>
      </div>
    </form>
  );
}
