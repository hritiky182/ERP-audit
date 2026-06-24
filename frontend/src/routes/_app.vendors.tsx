import { useEffect, useState, useMemo } from "react";
import { Building2, AlertTriangle, RefreshCw } from "lucide-react";
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
import { RiskBadge } from "@/components/common/RiskBadge";
import { vendorService } from "@/services/vendorService";
import type { Vendor } from "@/types";
import { usePageTitle } from "../hooks/usePageTitle";

export default function VendorsPage() {
  usePageTitle("Vendor Master Controls — CIS");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await vendorService.list();
        setVendors(res);
      } catch (err) {
        console.error("Failed to load vendors", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [query, riskFilter]);

  const high = useMemo(() => vendors.filter((v) => v.risk === "High").length, [vendors]);
  const changed = useMemo(
    () =>
      vendors.filter((v) => v.riskType.includes("Changed") || v.riskType.includes("Duplicate"))
        .length,
    [vendors],
  );

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (query && !`${v.name} ${v.id} ${v.riskType}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (riskFilter !== "all" && v.risk !== riskFilter) return false;
      return true;
    });
  }, [vendors, query, riskFilter]);

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
        title="Vendor Master Controls"
        description="Detect anomalies in vendor onboarding, bank account changes, and payment timing."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Vendors" value={vendors.length} icon={Building2} tone="info" />
        <StatCard label="Vendor Changes" value={changed} icon={RefreshCw} tone="medium" />
        <StatCard label="High Risk Vendors" value={high} icon={AlertTriangle} tone="high" />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search vendors…"
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
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {vendors.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Risk Type</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="font-medium">{v.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{v.id}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{v.createdDate}</TableCell>
                  <TableCell className="text-muted-foreground">{v.lastModified}</TableCell>
                  <TableCell>{v.riskType}</TableCell>
                  <TableCell>
                    <RiskBadge risk={v.risk} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(v)}>
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

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription className="font-mono text-xs">{selected.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-sm">
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">Created</dt>
                    <dd>{selected.createdDate}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Last Modified</dt>
                    <dd>{selected.lastModified}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Bank Account</dt>
                    <dd className="font-mono">{selected.bankAccount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Risk</dt>
                    <dd>
                      <RiskBadge risk={selected.risk} />
                    </dd>
                  </div>
                </dl>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Audit Observations
                  </h3>
                  <ul className="space-y-2">
                    {selected.observations.map((o, i) => (
                      <li key={i} className="rounded-md border border-border bg-muted/40 p-3">
                        {o}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
