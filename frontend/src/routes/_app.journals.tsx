import { useEffect, useState, useMemo } from "react";
import { BookOpenCheck, PencilLine, TrendingUp, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { RiskBadge } from "@/components/common/RiskBadge";
import { journalService } from "@/services/journalService";
import type { JournalEntry } from "@/types";
import { usePageTitle } from "../hooks/usePageTitle";

export default function JournalsPage() {
  usePageTitle("Journal Entry Controls — CIS");
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await journalService.list();
        setJournals(res);
      } catch (err) {
        console.error("Failed to load journals", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [query, riskFilter, typeFilter]);

  const manual = useMemo(() => journals.filter((j) => j.type === "Manual").length, [journals]);
  const high = useMemo(() => journals.filter((j) => j.amount > 200000).length, [journals]);
  const exc = useMemo(
    () =>
      journals.filter(
        (j) => j.flags.includes("No Approval") || j.flags.includes("Same User Posted and Approved"),
      ).length,
    [journals],
  );

  const filtered = useMemo(() => {
    return journals.filter((j) => {
      if (
        query &&
        !`${j.id} ${j.createdBy} ${j.approvedBy} ${j.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      if (riskFilter !== "all" && j.risk !== riskFilter) return false;
      if (typeFilter !== "all" && j.type !== typeFilter) return false;
      return true;
    });
  }, [journals, query, riskFilter, typeFilter]);

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
        title="Journal Entry Controls"
        description="Identify manual, backdated, and self-approved journal entries."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Entries" value={journals.length} icon={BookOpenCheck} tone="info" />
        <StatCard label="Manual Entries" value={manual} icon={PencilLine} tone="medium" />
        <StatCard label="High Value (>$200k)" value={high} icon={TrendingUp} tone="high" />
        <StatCard label="Approval Exceptions" value={exc} icon={ShieldAlert} tone="high" />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search journals…"
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {journals.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Journal ID</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-mono text-xs">{j.id}</TableCell>
                  <TableCell className="text-muted-foreground">{j.date}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${j.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{j.createdBy}</TableCell>
                  <TableCell
                    className={j.createdBy === j.approvedBy ? "text-risk-high font-medium" : ""}
                  >
                    {j.approvedBy}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {j.flags.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px]">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={j.risk} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(j)}>
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
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Journal Entry — {selected.id}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 pt-2 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Entry Date</dt>
                  <dd>{selected.date}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Type</dt>
                  <dd>{selected.type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Amount</dt>
                  <dd className="font-mono">${selected.amount.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Risk</dt>
                  <dd>
                    <RiskBadge risk={selected.risk} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Created By</dt>
                  <dd>{selected.createdBy}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Approved By</dt>
                  <dd>{selected.approvedBy}</dd>
                </div>
              </dl>
              {selected.flags.length > 0 && (
                <div className="mt-4 rounded-md border border-risk-high/30 bg-risk-high/10 p-3">
                  <p className="text-xs font-semibold text-risk-high">Risk Flags</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.flags.map((f) => (
                      <Badge key={f} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
