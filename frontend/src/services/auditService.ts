import { mockFindings, mockChanges, mockSoDConflicts } from "@/data/mockData";

export const auditService = {
  findings: async () => mockFindings,
  changes: async () => mockChanges,
  sod: async () => mockSoDConflicts,
};
