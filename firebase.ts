import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmkSnUi_DpywzukLa2RwR3Eyc6TZH-0rs",
    authDomain: "transchat-app-6f8c2.firebaseapp.com",
    projectId: "transchat-app-6f8c2",
    storageBucket: "transchat-app-6f8c2.appspot.com",
    messagingSenderId: "855852593577",
    appId: "1:855852593577:web:71eebe7f68b0e41397d4b8"
  };

  // Initialize Firebase
const app = getApps().length ? getApp()  : initializeApp(firebaseConfig);

const auth = getAuth(app); 
const db = getFirestore(app);
const functions = getFunctions(app);

export {db, auth , functions};