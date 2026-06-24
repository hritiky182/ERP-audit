import { useEffect, useState, useMemo } from "react";
import { ShieldAlert, AlertTriangle, Activity } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import { auditService } from "@/services/auditService";
import type { SoDConflict } from "@/types";
import { usePageTitle } from "../hooks/usePageTitle";

export default function SoDPage() {
  usePageTitle("SoD Conflicts — CIS");
  const [conflicts, setConflicts] = useState<SoDConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SoDConflict | null>(null);
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await auditService.sod();
        setConflicts(res);
      } catch (err) {
        console.error("Failed to load SoD conflicts", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [query, severityFilter, statusFilter]);

  const high = useMemo(() => conflicts.filter((c) => c.severity === "High").length, [conflicts]);
  const active = useMemo(() => conflicts.filter((c) => c.status === "Active").length, [conflicts]);

  const filtered = useMemo(() => {
    return conflicts.filter((c) => {
      if (
        query &&
        !`${c.user} ${c.conflictType} ${c.description}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      if (severityFilter !== "all" && c.severity !== severityFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      return true;
    });
  }, [conflicts, query, severityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page, pageSize]);

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
        title="SoD Conflict Analysis"
        description="Detect users with toxic privilege combinations across the ERP."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Conflicts" value={conflicts.length} icon={Activity} tone="info" />
        <StatCard label="High Risk Conflicts" value={high} icon={AlertTriangle} tone="high" />
        <StatCard label="Active Conflicts" value={active} icon={ShieldAlert} tone="medium" />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search conflicts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-64"
          />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Mitigated">Mitigated</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {conflicts.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conflict ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Conflict Type</TableHead>
                <TableHead>Risk Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.user}</TableCell>
                  <TableCell>{c.conflictType}</TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">
                    {c.description}
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={c.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>
                      Details
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Conflict Analysis — {selected.id}</DialogTitle>
                <DialogDescription>
                  {selected.user} · Detected {selected.detected}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conflict Type
                  </p>
                  <p className="mt-1 font-medium">{selected.conflictType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-1 text-muted-foreground">{selected.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <RiskBadge risk={selected.severity} />
                  <StatusBadge status={selected.status} />
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
                  <p className="font-medium">Recommended action</p>
                  <p className="mt-1 text-muted-foreground">
                    Remove conflicting role assignment or implement compensating mitigating control
                    with documented review cadence.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
