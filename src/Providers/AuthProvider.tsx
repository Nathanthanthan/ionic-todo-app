import { useIonToast } from "@ionic/react";
import { signOut, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Config/firebase";

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
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);
    
    return () => {
      unsubscribe();
    };
  }, []);

  async function logOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);

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
