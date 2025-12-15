import { Button } from "@/components/ui/button";
import { Wallet, FileText, Code } from "lucide-react";
import { NavAlerts } from "./NavAlerts";
import { useRealtimeData } from "@/hooks/useRealtimeData";

export function Navbar() {
  const { pools } = useRealtimeData();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">R</span>
          </div>
          <span className="text-sm font-semibold text-foreground">RWA NAV Coprocessor</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="nav" size="sm" className="hidden sm:flex gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Docs
          </Button>
          <Button variant="nav" size="sm" className="hidden sm:flex gap-1.5 text-xs">
            <Code className="h-3.5 w-3.5" />
            API
          </Button>
          <NavAlerts pools={pools} />
          <Button variant="glass" size="sm" className="gap-1.5 text-xs">
            <Wallet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
