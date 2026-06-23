import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — CIS" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure organization profile, risk thresholds, and notifications."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Organization Name</Label>
              <Input defaultValue="Acme Holdings Inc." />
            </div>
            <div className="space-y-1.5">
              <Label>ERP System</Label>
              <Input defaultValue="SAP S/4HANA · Oracle EBS" />
            </div>
            <div className="space-y-1.5">
              <Label>Audit Period</Label>
              <Input defaultValue="FY2026 (Jan – Dec)" />
            </div>
            <Button onClick={() => toast.success("General settings saved")}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Risk Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>High Risk Threshold (score ≥)</Label>
              <Input type="number" defaultValue={80} />
            </div>
            <div className="space-y-1.5">
              <Label>Medium Risk Threshold (score ≥)</Label>
              <Input type="number" defaultValue={50} />
            </div>
            <div className="space-y-1.5">
              <Label>Low Risk Threshold (score ≥)</Label>
              <Input type="number" defaultValue={20} />
            </div>
            <Button onClick={() => toast.success("Risk thresholds updated")}>
              Update Thresholds
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Email alerts for High Risk findings", defaultChecked: true },
              { label: "Email digest of weekly audit summary", defaultChecked: true },
              { label: "Dashboard alerts for new SoD conflicts", defaultChecked: true },
              { label: "Dashboard alerts for payment exceptions", defaultChecked: false },
            ].map((n, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-1">
                  <p className="text-sm">{n.label}</p>
                  <Switch defaultChecked={n.defaultChecked} />
                </div>
                {i < 3 && <Separator />}
              </div>
            ))}
            <Button onClick={() => toast.success("Notification preferences saved")}>
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
