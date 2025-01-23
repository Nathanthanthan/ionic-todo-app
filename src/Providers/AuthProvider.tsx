import { useIonToast } from "@ionic/react";
import { signOut, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { fbAuth } from "../Config/firebase";

export const AuthContext = createContext<{
  /**
   * The user that is currently logged in.
   * 
   * `undefined`: Not yet initialised.
   * 
   * `null`: Initialised, but not logged in.
   */
  currentUser: User | null | undefined,
  logOut: (() => Promise<void>) | undefined,
}>({
  currentUser: undefined,
  logOut: undefined,
});

export default function AuthProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [showToast] = useIonToast();

  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged(setCurrentUser);

    return () => {
      unsubscribe();
    };
  }, []);

  async function logOut() {
    try {
      await signOut(fbAuth);
    } catch (err) {
      console.error(err);

      showToast({
        message: "Error: failed to log out",
        color: "danger",
        duration: 2000,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
