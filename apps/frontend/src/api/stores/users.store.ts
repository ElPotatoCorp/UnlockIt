import { create } from "zustand";
import type { PublicUser, Paginated } from "@unlockit/shared";

interface UsersState {
    users: Paginated<PublicUser> | null;
    selectedUser: PublicUser | null;

    setUsers: (data: Paginated<PublicUser>) => void;
    setSelectedUser: (user: PublicUser) => void;
    clearSelectedUser: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
    users: null,
    selectedUser: null,

    setUsers: (data) => set({ users: data }),
    setSelectedUser: (user) => set({ selectedUser: user }),
    clearSelectedUser: () => set({ selectedUser: null }),
}));