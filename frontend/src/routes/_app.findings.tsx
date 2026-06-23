import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import { findingsService } from "@/services/findingsService";
import type { Finding } from "@/types";

export const Route = createFileRoute("/_app/findings")({
  head: () => ({ meta: [{ title: "Audit Findings — CIS" }] }),
  component: FindingsPage,
});

function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [mod, setMod] = useState("all");
  const [risk, setRisk] = useState("all");
  const [status, setStatus] = useState("all");
  const [sel, setSel] = useState<Finding | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await findingsService.list();
        setFindings(res);
      } catch (err) {
        console.error("Failed to load findings", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page to 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [q, mod, risk, status]);

  const modules = useMemo(() => Array.from(new Set(findings.map((f) => f.module))), [findings]);

  const filtered = findings.filter((f) => {
    if (q && !`${f.id} ${f.observation}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (mod !== "all" && f.module !== mod) return false;
    if (risk !== "all" && f.risk !== risk) return false;
    if (status !== "all" && f.status !== status) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Findings"
        description="Centralized repository for control deficiencies and remediation tracking."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Open Findings"
          value={findings.filter((f) => f.status === "Open").length}
          icon={ClipboardList}
          tone="high"
        />
        <StatCard
          label="Closed"
          value={findings.filter((f) => f.status === "Closed").length}
          icon={CheckCircle2}
          tone="low"
        />
        <StatCard
          label="High Risk"
          value={findings.filter((f) => f.risk === "High").length}
          icon={AlertTriangle}
          tone="high"
        />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search findings…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 w-64"
          />
          <Select value={mod} onValueChange={setMod}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {findings.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding ID</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Observation</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono text-xs">{f.id}</TableCell>
                  <TableCell>{f.module}</TableCell>
                  <TableCell className="max-w-md text-sm">{f.observation}</TableCell>
                  <TableCell>
                    <RiskBadge risk={f.risk} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{f.owner}</TableCell>
                  <TableCell>
                    <StatusBadge status={f.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSel(f)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-card">
            <div className="text-xs text-muted-foreground">
              Showing <b>{(page - 1) * pageSize + 1}</b> to{" "}
              <b>{Math.min(page * pageSize, filtered.length)}</b> of <b>{filtered.length}</b>{" "}
              entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {sel && (
            <>
              <SheetHeader>
                <SheetTitle>{sel.id}</SheetTitle>
                <SheetDescription>
                  {sel.module} · Reported {sel.date}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Observation
                  </p>
                  <p className="mt-1">{sel.observation}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommendation
                  </p>
                  <p className="mt-1 text-muted-foreground">{sel.recommendation}</p>
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge risk={sel.risk} />
                  <StatusBadge status={sel.status} />
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Remediation Owner
                  </p>
                  <p className="mt-1 font-medium">{sel.owner}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
