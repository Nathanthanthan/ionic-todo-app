import { signOut, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Config/firebase";
import { LOGIN } from "../Utils/Constants/Routes";
import { useHistory } from "react-router-dom";
import { useIonToast } from "@ionic/react";

export const AuthContext = createContext<{
  currentUser: User | null | undefined,
  logOut: (() => Promise<void>) | undefined,
}>({
  currentUser: undefined,
  logOut: undefined,
});

export default function AuthProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const history = useHistory();
  const [showToast] = useIonToast();

  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    auth.onAuthStateChanged(setCurrentUser);
  }, []);

  async function logOut() {
    try {
      await signOut(auth);
      history.push(LOGIN);
    } catch (err) {
      console.log(err);

      showToast({
        message: "Error: failed to log out",
        duration: 2000,
        color: "danger",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
