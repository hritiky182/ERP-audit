import { api } from "./api";
import { mockFindings } from "@/data/mockData";
import type { Finding } from "@/types";

export const findingsService = {
  list: async (): Promise<Finding[]> => {
    // API Placeholder:
    // return api.get("/findings").then((r) => r.data);
    return mockFindings;
  },
  get: async (id: string): Promise<Finding | undefined> => {
    // API Placeholder:
    // return api.get(`/findings/${id}`).then((r) => r.data);
    return mockFindings.find((f) => f.id === id);
  },
  updateStatus: async (id: string, status: Finding["status"]): Promise<Finding> => {
    // API Placeholder:
    // return api.patch(`/findings/${id}`, { status }).then((r) => r.data);
    const finding = mockFindings.find((f) => f.id === id);
    if (!finding) throw new Error("Finding not found");
    finding.status = status;
    return finding;
  },
};
