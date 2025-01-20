import {
  IonButton,
  IonContent,
  IonInput,
  IonNote,
  IonPage,
  useIonToast,
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { z } from "zod";
import { auth } from "../Config/firebase";
import { SIGN_UP, TASKS } from "../Utils/Constants/Routes";
import useForm from "../Utils/Hooks/UseForm";

const formSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email("Invalid email"),
  password: z.string().min(1, { message: "Required" }),
});

export default function Login() {
  const inputRef = useRef<HTMLIonInputElement>(null);

  const [showToast] = useIonToast();
  const history = useHistory();
  const {
    formValues: { email, password },
    editField,
    errors,
    submitForm,
  } = useForm(formSchema);

  async function onSubmitionSuccess() {
    if (email === undefined || password === undefined) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      showToast({
        message: "Successfully logged in",
        duration: 2000,
        color: "success",
      });

      history.push(TASKS);
    } catch (error) {
      console.error("Error: failed to log in", error);

      showToast({
        message: "Error: failed to log in",
        duration: 2000,
        color: "danger",
      });
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form
          className="flex flex-col gap-6 justify-center items-center size-full"
          onSubmit={submitForm(onSubmitionSuccess)}
        >
          <h1>Login</h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <IonInput
                type="text"
                ref={inputRef}

                label="Email"
                labelPlacement="floating"
                placeholder="example@email.com"

                value={email}
                onIonInput={e => typeof e.target.value === "string" && editField("email", e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
              />

              {errors?.email && (
                <IonNote color="danger" slot="end">
                  {errors.email._errors[0]}
                </IonNote>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <IonInput
                type="password"
                ref={inputRef}

                label="Password"
                labelPlacement="floating"
                placeholder="Something very hard to guess"

                value={password}
                onIonInput={e => typeof e.target.value === "string" && editField("password", e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
              />

              {errors?.password && (
                <IonNote color="danger" slot="end">
                  {errors.password._errors[0]}
                </IonNote>
              )}
            </div>
          </div>

          <IonButton
            type="submit"
            disabled={errors !== undefined}
          >
            Log in
          </IonButton>

          <button
            type="button"
            className="underline"
            onClick={() => history.push(SIGN_UP)}
          >
            Sign up
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
}
