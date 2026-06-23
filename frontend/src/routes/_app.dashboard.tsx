import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/common/RiskBadge";
import { dashboardService } from "@/services/dashboardService";
import type { Finding } from "@/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Executive Dashboard — CIS" }] }),
  component: DashboardPage,
});

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  month: string;
  High: number;
  Medium: number;
  Low: number;
}

interface ModuleData {
  module: string;
  count: number;
}

function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, high: 0, med: 0, low: 0, open: 0, closed: 0 });
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [byModule, setByModule] = useState<ModuleData[]>([]);
  const [recent, setRecent] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, pieRes, trendRes, moduleRes, recentRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRiskDistribution(),
          dashboardService.getFindingsTrend(),
          dashboardService.getFindingsByModule(),
          dashboardService.getRecentHighSeverity(),
        ]);
        setStats(statsRes);
        setPieData(pieRes);
        setTrendData(trendRes);
        setByModule(moduleRes);
        setRecent(recentRes);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Audit Dashboard"
        description="Continuous monitoring of ERP controls across modules."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Findings" value={stats.total} icon={Activity} tone="info" />
        <StatCard label="High Risk" value={stats.high} icon={AlertTriangle} tone="high" />
        <StatCard label="Medium Risk" value={stats.med} icon={ShieldAlert} tone="medium" />
        <StatCard label="Low Risk" value={stats.low} icon={ShieldCheck} tone="low" />
        <StatCard label="Open" value={stats.open} icon={TrendingUp} tone="high" />
        <StatCard label="Closed" value={stats.closed} icon={CheckCircle2} tone="low" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Findings Trend (12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="var(--risk-high)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="medium"
                  stroke="var(--risk-medium)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="var(--risk-low)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Findings by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byModule}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="module" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Recent High Severity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((f) => (
              <div
                key={f.id}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {f.id} · {f.module}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{f.observation}</p>
                </div>
                <RiskBadge risk={f.risk} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
