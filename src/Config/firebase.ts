import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// axios.defaults.baseURL = process.env.API_URL;
axios.defaults.baseURL = "https://tasklist-b5266-default-rtdb.europe-west1.firebasedatabase.app";

const fbConfig = {
  apiKey: "AIzaSyAPJR8J98JRIrn5Axy611azhO2vCzJBiCk",
  authDomain: "tasklist-b5266.firebaseapp.com",
  databaseURL: "https://tasklist-b5266-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tasklist-b5266",
  storageBucket: "tasklist-b5266.firebasestorage.app",
  messagingSenderId: "419321644624",
  appId: "1:419321644624:web:969bc451552bc7487bb355",
};

const fbApp = initializeApp(fbConfig);
export const fbAuth = getAuth(fbApp);

// export const fbSecret = process.env.FIREBASE_SECRET;
export const fbSecret = "78uHs8NWCwcz5mSrdp6NjiiYRP1PakhKpwpRHsbN";
