import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZXIAYnvmS6Qj9CVXD0F_yt0ZBxjin5-8",
  authDomain: "conexion-firebase-86e27.firebaseapp.com",
  projectId: "conexion-firebase-86e27",
  storageBucket: "conexion-firebase-86e27.appspot.com", // ⚠️ corregido
  messagingSenderId: "158995041222",
  appId: "1:158995041222:web:ac13f5d3df0e8cc5fc00c7",
};

const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});