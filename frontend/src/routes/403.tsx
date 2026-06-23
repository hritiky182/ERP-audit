import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/403")({
  head: () => ({ meta: [{ title: "403 Forbidden — CIS" }] }),
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          403 - Access Denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have the required permissions to access this resource. Please contact your
          system administrator.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
