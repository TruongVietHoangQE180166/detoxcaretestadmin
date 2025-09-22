import { create } from 'zustand';

interface UserState {
  user: {
    userId: string;
    username: string;
    email: string;
    role: string;
    status: string;
    accessToken: string;
  } | null;
  setUser: (userData: UserState['user']) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));