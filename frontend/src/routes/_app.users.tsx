import { useMemo, useState, useEffect } from "react";
import { Users, UserX, ShieldAlert, UserCog } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import { userService } from "@/services/userService";
import type { User } from "@/types";
import { usePageTitle } from "../hooks/usePageTitle";

export default function UsersPage() {
  usePageTitle("User Access Review — CIS");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");
  const [selected, setSelected] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await userService.list();
        setUsers(res);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [query, dept, status, risk]);

  const depts = useMemo(() => Array.from(new Set(users.map((u) => u.department))), [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (query && !`${u.name} ${u.id} ${u.email}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (dept !== "all" && u.department !== dept) return false;
      if (status !== "all" && u.status !== status) return false;
      if (risk !== "all" && u.risk !== risk) return false;
      return true;
    });
  }, [users, query, dept, status, risk]);

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
        title="User Access Controls"
        description="Continuous review of ERP user entitlements, dormant accounts, and privileged access."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={Users} tone="info" />
        <StatCard
          label="Dormant Users"
          value={users.filter((u) => u.status === "Dormant").length}
          icon={UserX}
          tone="medium"
        />
        <StatCard
          label="Admin Users"
          value={users.filter((u) => u.isAdmin).length}
          icon={UserCog}
          tone="high"
        />
        <StatCard
          label="Unauthorized"
          value={users.filter((u) => u.unauthorized).length}
          icon={ShieldAlert}
          tone="high"
        />
      </div>

      <Card className="border-border/60 bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Input
            placeholder="Search users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full sm:w-64"
          />
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {depts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Dormant">Dormant</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
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
          <div className="ml-auto text-xs text-muted-foreground">
            Showing <b className="text-foreground">{filtered.length}</b> of {users.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </TableCell>
                  <TableCell>{u.department}</TableCell>
                  <TableCell>
                    {u.role}
                    {u.isAdmin && (
                      <Badge variant="secondary" className="ml-2">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell>
                    <StatusBadge status={u.status} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge risk={u.risk} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(u)}>
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
                <SheetDescription className="font-mono text-xs">
                  {selected.id} · {selected.email}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-sm">
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User Information
                  </h3>
                  <dl className="grid grid-cols-2 gap-3">
                    <div>
                      <dt className="text-xs text-muted-foreground">Department</dt>
                      <dd>{selected.department}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Role</dt>
                      <dd>{selected.role}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Status</dt>
                      <dd>
                        <StatusBadge status={selected.status} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Risk Rating</dt>
                      <dd>
                        <RiskBadge risk={selected.risk} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Last Login</dt>
                      <dd>{selected.lastLogin}</dd>
                    </div>
                  </dl>
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Access Rights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.accessRights.length ? (
                      selected.accessRights.map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No access rights assigned.</p>
                    )}
                  </div>
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Risk Observations
                  </h3>
                  <ul className="space-y-2">
                    {selected.observations.map((o, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-border bg-muted/40 p-3 text-sm"
                      >
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
