import { FileDown, FileSpreadsheet, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { reportsService } from "@/services/reportsService";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";

const reports = [
  {
    id: "ua",
    title: "User Access Report",
    desc: "Active, dormant and privileged user entitlements across the ERP.",
  },
  {
    id: "sod",
    title: "SoD Conflict Report",
    desc: "Toxic role combinations with severity and mitigation status.",
  },
  {
    id: "ven",
    title: "Vendor Risk Report",
    desc: "Bank account changes, duplicates, and high-risk onboarding.",
  },
  {
    id: "pay",
    title: "Payment Exception Report",
    desc: "Duplicate, weekend, after-hours, and unauthorized payments.",
  },
  {
    id: "je",
    title: "Journal Entry Exception Report",
    desc: "Manual, backdated, and self-approved journal entries.",
  },
  {
    id: "chg",
    title: "Change Management Report",
    desc: "Unapproved, emergency, and direct production changes.",
  },
  {
    id: "final",
    title: "Final Audit Report",
    desc: "Consolidated executive findings, recommendations and trends.",
  },
];

export default function ReportsPage() {
  usePageTitle("Reports — CIS");
  const [exporting, setExporting] = useState<string | null>(null);

  const onExport = async (reportId: string, title: string, format: "PDF" | "Excel") => {
    setExporting(`${reportId}-${format}`);
    try {
      const res = await reportsService.exportReport({
        reportId,
        format,
      });
      if (res.success) {
        toast.success(`${title} exported successfully! Mock download URL: ${res.downloadUrl}`);
      } else {
        toast.error(`Failed to export ${title}`);
      }
    } catch (err) {
      toast.error(`Error exporting ${title}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Center"
        description="Generate and export audit reports across modules."
      />

      <Card className="border-border/60 bg-card">
        <CardContent className="flex flex-wrap items-end gap-4 p-5">
          <div className="space-y-1.5">
            <Label className="text-xs">From</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="date" className="h-9 w-48 pl-9" defaultValue="2026-01-01" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="date" className="h-9 w-48 pl-9" defaultValue="2026-06-23" />
            </div>
          </div>
          <Button onClick={() => toast.success("Date range filter applied (demo)")}>
            Apply Range
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="border-border/60 bg-card transition-shadow hover:shadow-md">
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div>
                <h3 className="text-base font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <div className="mt-auto flex gap-2 pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={exporting !== null}
                  onClick={() => onExport(r.id, r.title, "PDF")}
                >
                  <FileDown className="mr-1.5 h-4 w-4" />{" "}
                  {exporting === `${r.id}-PDF` ? "Exporting..." : "PDF"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={exporting !== null}
                  onClick={() => onExport(r.id, r.title, "Excel")}
                >
                  <FileSpreadsheet className="mr-1.5 h-4 w-4" />{" "}
                  {exporting === `${r.id}-Excel` ? "Exporting..." : "Excel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
