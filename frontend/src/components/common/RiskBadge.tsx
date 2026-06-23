import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Risk } from "@/types";

const styles: Record<Risk, string> = {
  High: "bg-risk-high/15 text-risk-high border-risk-high/30",
  Medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/40",
  Low: "bg-risk-low/15 text-risk-low border-risk-low/30",
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[risk], className)}>
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          risk === "High" && "bg-risk-high",
          risk === "Medium" && "bg-risk-medium",
          risk === "Low" && "bg-risk-low",
        )}
      />
      {risk}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Open: "bg-risk-high/15 text-risk-high border-risk-high/30",
    Closed: "bg-risk-low/15 text-risk-low border-risk-low/30",
    "In Progress": "bg-info/15 text-info border-info/30",
    Active: "bg-risk-low/15 text-risk-low border-risk-low/30",
    Dormant: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
    Disabled: "bg-muted text-muted-foreground border-border",
    Approved: "bg-risk-low/15 text-risk-low border-risk-low/30",
    Pending: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
    Unauthorized: "bg-risk-high/15 text-risk-high border-risk-high/30",
    Mitigated: "bg-info/15 text-info border-info/30",
    Emergency: "bg-risk-high/15 text-risk-high border-risk-high/30",
    Unapproved: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  };
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", map[status] ?? "bg-muted text-muted-foreground")}
    >
      {status}
    </Badge>
  );
}
