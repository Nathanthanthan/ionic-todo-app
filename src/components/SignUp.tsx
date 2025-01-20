import {
  IonButton,
  IonContent,
  IonInput,
  IonNote,
  IonPage,
  useIonToast,
} from "@ionic/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { z } from "zod";
import { auth } from "../Config/firebase";
import { LOGIN, TODOS } from "../Utils/Constants/Routes";
import useForm from "../Utils/Hooks/UseForm";

const formSchema = z.object({
  displayName: z.string().min(1, { message: "Required" }),
  email: z.string().min(1, { message: "Required" }).email("Invalid email"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function SignUp() {
  const inputRef = useRef<HTMLIonInputElement>(null);

  const [showToast] = useIonToast();
  const history = useHistory();
  const {
    formValues: { displayName, email, password },
    editField,
    errors,
    submitForm,
  } = useForm(formSchema);

  async function onSubmitionSuccess() {
    if (email === undefined || password === undefined) return;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, { displayName });

      showToast({
        message: "Successfully signed up",
        duration: 2000,
        color: "success",
      });

      history.push(TODOS);
    } catch (error) {
      console.error("Error: failed to sign up", error);

      showToast({
        message: "Error: failed to sign up",
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
          <h1>Sign up</h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <IonInput
                type="text"
                ref={inputRef}

                label="Username"
                labelPlacement="floating"
                placeholder="A cool alias"

                value={displayName}
                onIonInput={e => typeof e.target.value === "string" && editField("displayName", e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitForm(onSubmitionSuccess)}
              />

              {errors?.displayName && (
                <IonNote color="danger" slot="end">
                  {errors.displayName._errors[0]}
                </IonNote>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <IonInput
                type="text"

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
            Sign up
          </IonButton>

          <button
            type="button"
            className="underline"
            onClick={() => history.push(LOGIN)}
          >
            Login
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
}
