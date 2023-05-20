import { create } from "zustand";
import { persist } from "zustand/middleware";
/* 
export const useUserStore = create(
  persist(
    (set, get) => ({
      access_token: "",
      setAccessToken: (accessToken) => {
        set((state) => ({
          access_token: accessToken,
        }));
      },
      id_token: "",
      setIdToken: (idToken) => {
        set((state) => ({
          id_token: idToken,
        }));
      },
    }),
    { name: "userStorage" }
  )
); */

export const userStore = create(
  persist(
    (set) => ({
      tokens: {},
      setTokens: (tokens) => set({ tokens }),
      user: {},
      setUser: (user) => set({ user }),
      _hasHydrated: false,
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => () => {
        userStore.setState({ _hasHydrated: true });
      },
    }
  )
);
