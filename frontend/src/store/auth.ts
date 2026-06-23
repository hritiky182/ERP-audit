import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (email) =>
        set({
          user: {
            email,
            name: email
              .split("@")[0]
              .replace(/\./g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            role: "Lead Auditor",
          },
        }),
      logout: () => set({ user: null }),
    }),
    { name: "erp-audit-auth" },
  ),
);
