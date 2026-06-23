import { mockPayments } from "@/data/mockData";
import type { Payment } from "@/types";

export const paymentService = {
  list: async (): Promise<Payment[]> => mockPayments,
};
