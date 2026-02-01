import { create } from "zustand";
import { clearToken, setToken } from "../utils/storage";

export type Role = "user" | "admin" | "staff";

type User = {
  _id: string;
  username?: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    setToken(token);
    set({ token, user });
  },
  logout: () => {
    clearToken();
    set({ token: null, user: null });
  },
}));
