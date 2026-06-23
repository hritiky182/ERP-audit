import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { GitPullRequestArrow, AlertCircle, Zap, Server } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import { auditService } from "@/services/auditService";
import type { Change } from "@/types";

export const Route = createFileRoute("/_app/changes")({
  head: () => ({ meta: [{ title: "Change Management — CIS" }] }),
  component: ChangesPage,
});

function ChangesPage() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await auditService.changes();
        setChanges(res);
      } catch (err) {
        console.error("Failed to load changes", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [query, riskFilter, statusFilter]);

  const unapproved = useMemo(
    () => changes.filter((c) => c.status === "Unapproved").length,
    [changes],
  );
  const emergency = useMemo(
    () => changes.filter((c) => c.status === "Emergency").length,
    [changes],
  );
  const prod = useMemo(
    () => changes.filter((c) => c.flags.includes("Direct Production Change")).length,
    [changes],
  );

  const filtered = useMemo(() => {
    return changes.filter((c) => {
      if (
        query &&
        !`${c.id} ${c.requestedBy} ${c.approvedBy} ${c.changeType}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (riskFilter !== "all" && c.risk !== riskFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      return true;
    });
  }, [changes, query, riskFilter, statusFilter]);

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
        title="Change Management Controls"
        description="Track approvals, testing evidence, and rollback plans for ERP changes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Changes"
          value={changes.length}
          icon={GitPullRequestArrow}
          tone="info"
        />
        <StatCard label="Unapproved" value={unapproved} icon={AlertCircle} tone="medium" />
        <StatCard label="Emergency" value={emergency} icon={Zap} tone="high" />
        <StatCard label="Direct Production" value={prod} icon={Server} tone="high" />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search changes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-64"
          />
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Risk Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Unapproved">Unapproved</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {changes.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change ID</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.module}</Badge>
                  </TableCell>
                  <TableCell>{c.changeType}</TableCell>
                  <TableCell>{c.requestedBy}</TableCell>
                  <TableCell className={c.approvedBy === "—" ? "text-risk-high font-semibold" : ""}>
                    {c.approvedBy}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.flags.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px]">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={c.risk} />
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
    </div>
  );
}
