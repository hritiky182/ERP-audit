import { api } from "./api";

export interface ExportReportOptions {
  reportId: string;
  format: "PDF" | "Excel";
  fromDate?: string;
  toDate?: string;
}

export const reportsService = {
  exportReport: async (
    options: ExportReportOptions,
  ): Promise<{ success: boolean; downloadUrl: string }> => {
    // API Placeholder:
    // return api.post("/reports/export", options).then((r) => r.data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          downloadUrl: `/downloads/reports/${options.reportId}-${Date.now()}.${options.format.toLowerCase() === "pdf" ? "pdf" : "xlsx"}`,
        });
      }, 600);
    });
  },
};
