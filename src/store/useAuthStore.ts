import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;        // internal unique id
  userId: string;    // user-chosen login ID (e.g. "aarav", "priya")
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  password?: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  createdAt: string;
}

interface AuthState {
  users: User[];
  currentUser: User | null;
  login: (userId: string, password?: string) => { success: boolean; error?: string };
  register: (userData: Omit<User, "id" | "createdAt">) => { success: boolean; error?: string };
  updateProfile: (data: Partial<Omit<User, "id" | "createdAt">>) => void;
  logout: () => void;
}

const PRESEEDED_USERS: User[] = [
  {
    id: "usr_aarav_01",
    userId: "aarav",
    fullName: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "+91 98450 11223",
    companyName: "Sharma Textiles & Retail",
    password: "1234",
    shippingAddress: "12 MG Road",
    city: "Bengaluru",
    pincode: "560001",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "usr_priya_02",
    userId: "priya",
    fullName: "Priya Nair",
    email: "priya@example.com",
    phone: "+91 99001 44556",
    companyName: "Nair Design Studio",
    password: "1234",
    shippingAddress: "45 Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    createdAt: "2026-02-01T11:30:00.000Z",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: PRESEEDED_USERS,
      currentUser: null,

      login: (loginId: string, password?: string) => {
        const cleanId = loginId.trim().toLowerCase();

        // Try matching by userId first, then by email
        const user =
          get().users.find((u) => u.userId?.toLowerCase() === cleanId) ||
          get().users.find((u) => u.email.toLowerCase() === cleanId);

        if (!user) {
          return { success: false, error: "No account found with this User ID." };
        }

        if (password && user.password && user.password !== password) {
          return { success: false, error: "Incorrect password. Please try again." };
        }

        set({ currentUser: user });
        return { success: true };
      },

      register: (userData) => {
        const cleanUserId = (userData.userId || "").trim().toLowerCase();
        const cleanEmail = userData.email.trim().toLowerCase();

        if (cleanUserId && get().users.some((u) => u.userId?.toLowerCase() === cleanUserId)) {
          return { success: false, error: "This User ID is already taken. Please choose another." };
        }

        if (get().users.some((u) => u.email.toLowerCase() === cleanEmail)) {
          return { success: false, error: "An account with this email already exists." };
        }

        const newUser: User = {
          ...userData,
          id: `usr_${Date.now()}`,
          userId: cleanUserId || `user_${Date.now()}`,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }));

        return { success: true };
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.currentUser) return state;

          const updatedUser: User = {
            ...state.currentUser,
            ...data,
          };

          return {
            users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
            currentUser: updatedUser,
          };
        });
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: "printcraft-user-auth",
      merge: (persistedState: any, currentState: AuthState) => {
        const persistedUsers: User[] = persistedState?.users || [];
        const mergedUsers = [...persistedUsers];

        // Always ensure demo accounts are present
        for (const seeded of PRESEEDED_USERS) {
          if (!mergedUsers.some((u) => u.id === seeded.id)) {
            mergedUsers.push(seeded);
          }
        }

        return {
          ...currentState,
          users: mergedUsers,
          currentUser: persistedState?.currentUser || null,
        };
      },
    }
  )
);
