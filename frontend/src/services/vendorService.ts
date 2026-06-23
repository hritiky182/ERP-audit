import { mockVendors } from "@/data/mockData";
import type { Vendor } from "@/types";

export const vendorService = {
  list: async (): Promise<Vendor[]> => mockVendors,
  get: async (id: string) => mockVendors.find((v) => v.id === id),
};
