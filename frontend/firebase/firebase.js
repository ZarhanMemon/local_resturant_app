import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "local-restaraunt-app.firebaseapp.com",
  projectId: "local-restaraunt-app",
  storageBucket: "local-restaraunt-app.firebasestorage.app",
  messagingSenderId: "139390791856",
  appId: "1:139390791856:web:b41bc3712c72f9e04acb75"
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
