import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAhSYSkYEz6uh7DO1k9DBItGDxkXPITtp0",
  authDomain: "driversync-b0b4c.firebaseapp.com",
  projectId: "driversync-b0b4c",
  storageBucket: "driversync-b0b4c.appspot.com",
  messagingSenderId: "712749584983",
  appId: "1:712749584983:web:6ab0b5370172b210628912",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
