// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoyxgj5rAWVTQ5aHRrj3bIX5iw68-LfBM",
  authDomain: "heritage-grove-d4174.firebaseapp.com",
  projectId: "heritage-grove-d4174",
  storageBucket: "heritage-grove-d4174.firebasestorage.app",
  messagingSenderId: "701640922413",
  appId: "1:701640922413:web:a26f2a1b3f36efe1702fa4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app)