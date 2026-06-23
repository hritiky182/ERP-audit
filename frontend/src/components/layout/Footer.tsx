import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="w-full border-t border-border bg-card py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      <div>© CIS – We Make IT Possible</div>
      <div className="flex gap-4">
        <a
          href="https://www.cisin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline transition-colors"
        >
          Website
        </a>
        <button
          onClick={() => setOpen(true)}
          className="hover:text-foreground hover:underline cursor-pointer bg-transparent border-0 p-0 transition-colors"
        >
          About Product
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">About Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-sm text-foreground">
            <div>
              <p className="font-semibold text-base">ERP Controls Audit Dashboard</p>
              <p className="text-muted-foreground text-xs">Continuous Assurance Cockpit</p>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs border-t border-border pt-3">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">1.0.0</span>
              <span className="text-muted-foreground">Developed by:</span>
              <span className="font-medium">CIS</span>
              <span className="text-muted-foreground">Website:</span>
              <a
                href="https://www.cisin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                www.cisin.com
              </a>
            </div>
            <div className="text-[11px] text-muted-foreground text-center pt-3 italic">
              "We Make IT Possible"
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
