import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

type Props = Readonly<{
  isOpen: boolean;
  closeModal: () => void;

  title?: string;
  content: React.ReactNode;
  confirmButtonColor?: string;

  onCancel?: () => void;
  onConfirm: () => void;
}>;

export default function ConfirmationModal({
  isOpen,
  closeModal,

  title,
  content,
  confirmButtonColor,

  onCancel,
  onConfirm,
}: Props) {
  function handleCancel() {
    onCancel !== undefined && onCancel();
    closeModal();
  }

  function handleConfirm() {
    onConfirm();
    closeModal();
  }

  return (
    <IonModal
      isOpen={isOpen}
      onIonModalDidDismiss={closeModal}
    >
      {title && (
        <IonHeader>
          <IonToolbar>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
      )}

      <IonContent className="ion-padding">
        <div className="flex flex-col gap-10 justify-center size-full">
          <div>{content}</div>

          <div className="flex">
            <IonButton
              className="flex-1"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </IonButton>

            <IonButton
              className="flex-1"
              color={confirmButtonColor ?? "danger"}
              onClick={handleConfirm}
            >
              Confirm
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
