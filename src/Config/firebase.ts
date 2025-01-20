import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyAPJR8J98JRIrn5Axy611azhO2vCzJBiCk",
  authDomain: "tasklist-b5266.firebaseapp.com",
  databaseURL: "https://tasklist-b5266-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tasklist-b5266",
  storageBucket: "tasklist-b5266.firebasestorage.app",
  messagingSenderId: "419321644624",
  appId: "1:419321644624:web:969bc451552bc7487bb355",
};

const app = initializeApp(config);

export const auth = getAuth(app);
