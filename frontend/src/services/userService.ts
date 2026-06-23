import { api } from "./api";
import { mockUsers } from "@/data/mockData";
import type { User } from "@/types";

export const userService = {
  list: async (): Promise<User[]> => {
    // return api.get("/users").then((r) => r.data);
    return mockUsers;
  },
  get: async (id: string): Promise<User | undefined> => {
    // return api.get(`/users/${id}`).then((r) => r.data);
    return mockUsers.find((u) => u.id === id);
  },
};

export { api };
