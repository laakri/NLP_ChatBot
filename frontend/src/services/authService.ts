import { auth } from "../firebase/init";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { User } from "../store/authStore";

export const signUp = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  saveUserData(userCredential.user);
  return userCredential.user;
};

export const login = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  saveUserData(userCredential.user);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  localStorage.removeItem("userData");
};

export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem("userData") !== null;
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

const saveUserData = (firebaseUser: FirebaseUser) => {
  const userData: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
  };
  localStorage.setItem("userData", JSON.stringify(userData));
};
