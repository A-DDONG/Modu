// Firebase 설정 파일
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3iQr4mWh78YV3dyfbAnnTWjubflAe6Kk",
  authDomain: "modu-e6ad1.firebaseapp.com",
  projectId: "modu-e6ad1",
  storageBucket: "modu-e6ad1.appspot.com",
  messagingSenderId: "760540365536",
  appId: "1:760540365536:web:7590c128cd12a59672c685",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const db = getFirestore(app);
