import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { isUserLoggedIn, getUserData } from "../services/authService";

export interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: FirebaseUser | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: isUserLoggedIn(),
  user: isUserLoggedIn() ? getUserData() : null,
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUser: (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
      };
      set({ user });
    } else {
      set({ user: null });
    }
  },
}));
