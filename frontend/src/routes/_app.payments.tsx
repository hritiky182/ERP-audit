import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { CreditCard, AlertTriangle, Copy, ShieldAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { paymentService } from "@/services/paymentService";
import type { Payment } from "@/types";

export const Route = createFileRoute("/_app/payments")({
  head: () => ({ meta: [{ title: "Payment Controls — CIS" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await paymentService.list();
        setPayments(res);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [query, riskFilter, approvalFilter]);

  const dup = useMemo(
    () => payments.filter((p) => p.tags.includes("Duplicate")).length,
    [payments],
  );
  const sus = useMemo(() => payments.filter((p) => p.risk === "High").length, [payments]);
  const exc = useMemo(
    () => payments.filter((p) => p.approvalStatus === "Unauthorized").length,
    [payments],
  );

  const trend = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const slice = payments.filter((p) => p.date === d.toISOString().slice(0, 10));
      return {
        day: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
        total: Math.round(slice.reduce((s, p) => s + p.amount, 0)),
      };
    });
  }, [payments]);

  const dupTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      duplicates: Math.round(5 + Math.sin(i) * 3 + i),
    }));
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (
        query &&
        !`${p.vendor} ${p.invoice} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      if (riskFilter !== "all" && p.risk !== riskFilter) return false;
      if (approvalFilter !== "all" && p.approvalStatus !== approvalFilter) return false;
      return true;
    });
  }, [payments, query, riskFilter, approvalFilter]);

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
        title="Payment Controls"
        description="Detect duplicate, weekend, after-hours, and unauthorized payments."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Payments" value={payments.length} icon={CreditCard} tone="info" />
        <StatCard label="Duplicate Payments" value={dup} icon={Copy} tone="high" />
        <StatCard label="Suspicious Payments" value={sus} icon={AlertTriangle} tone="high" />
        <StatCard label="Approval Exceptions" value={exc} icon={ShieldAlert} tone="medium" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Payment Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="pay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="var(--chart-1)" fill="url(#pay)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Duplicate Payments by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dupTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="duplicates" fill="var(--risk-high)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search payments…"
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
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Approval Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Unauthorized">Unauthorized</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {payments.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.vendor}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.invoice}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${p.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.approvalStatus} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={p.risk} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
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
