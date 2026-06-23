import { api } from "./api";
import { mockFindings, findingsTrend } from "@/data/mockData";

export const dashboardService = {
  getStats: async () => {
    // API Placeholder:
    // return api.get("/dashboard/stats").then((r) => r.data);
    const total = mockFindings.length;
    const high = mockFindings.filter((f) => f.risk === "High").length;
    const med = mockFindings.filter((f) => f.risk === "Medium").length;
    const low = mockFindings.filter((f) => f.risk === "Low").length;
    const open = mockFindings.filter((f) => f.status === "Open").length;
    const closed = mockFindings.filter((f) => f.status === "Closed").length;
    return { total, high, med, low, open, closed };
  },

  getRiskDistribution: async () => {
    // API Placeholder:
    // return api.get("/dashboard/risk-distribution").then((r) => r.data);
    const high = mockFindings.filter((f) => f.risk === "High").length;
    const med = mockFindings.filter((f) => f.risk === "Medium").length;
    const low = mockFindings.filter((f) => f.risk === "Low").length;
    return [
      { name: "High", value: high, color: "var(--risk-high)" },
      { name: "Medium", value: med, color: "var(--risk-medium)" },
      { name: "Low", value: low, color: "var(--risk-low)" },
    ];
  },

  getFindingsTrend: async () => {
    // API Placeholder:
    // return api.get("/dashboard/findings-trend").then((r) => r.data);
    return findingsTrend;
  },

  getFindingsByModule: async () => {
    // API Placeholder:
    // return api.get("/dashboard/findings-by-module").then((r) => r.data);
    const modules = ["User Access", "SoD", "Vendor", "Payments", "Journals", "Change Management"];
    return modules.map((m) => ({
      module: m,
      count: mockFindings.filter((f) => f.module === m).length,
    }));
  },

  getRecentHighSeverity: async (limit = 6) => {
    // API Placeholder:
    // return api.get(`/dashboard/recent-high?limit=${limit}`).then((r) => r.data);
    return [...mockFindings]
      .filter((f) => f.risk === "High")
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  },
};
