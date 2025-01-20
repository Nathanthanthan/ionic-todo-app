import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import useForm from "../../Utils/Hooks/UseForm";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
});

type Props = Readonly<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (taskName: string) => void;
}>;

export default function TaskCreationModal({ isOpen, setIsOpen, onSubmit }: Props) {
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

type ContentProps = Readonly<{
  didPresent: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (taskName: string) => void;
}>;

function TaskCreationModalContent({ setIsOpen, onSubmit, didPresent }: ContentProps) {
  const inputRef = useRef<HTMLIonInputElement>(null);

  const {
    formValues: { name },
    editField,
    errors,
    submitForm,
  } = useForm(formSchema);

  useEffect(() => {
    if (didPresent && inputRef.current !== null) inputRef.current.setFocus();
  }, [didPresent]);

  function onSubmitionSuccess() {
    if (name === undefined) return;

    onSubmit(name);
    setIsOpen(false);
  }

  return (
    <form
      className="flex flex-col gap-10 justify-center size-full"
      onSubmit={submitForm(onSubmitionSuccess)}
    >
      <div className="flex flex-col gap-1">
        <IonInput
          type="text"
          ref={inputRef}

          label="Name"
          labelPlacement="floating"
          placeholder="New task..."

          value={name}
          onIonInput={e => typeof e.target.value === "string" && editField("name", e.target.value)}
          onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
        />

        {errors?.name && (
          <IonNote color="danger" slot="end">
            {errors.name._errors[0]}
          </IonNote>
        )}
      </div>

      <div className="flex">
        <IonButton
          className="flex-1"
          color="secondary"
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
