import { mockJournals } from "@/data/mockData";
import type { JournalEntry } from "@/types";

export const journalService = {
  list: async (): Promise<JournalEntry[]> => mockJournals,
};
