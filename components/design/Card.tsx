import { cn } from "@/lib/utils";

type PanelVariant = "default" | "elevated" | "dark" | "stat";

interface PanelProps {
  variant?: PanelVariant;
  className?: string;
  children: React.ReactNode;
}

const VARIANTS: Record<PanelVariant, string> = {
  default: "card p-6",
  elevated: "card-elevated p-6",
  dark: "rounded-xl bg-zinc-950 text-white p-6 md:p-8",
  stat: "card p-5",
};

export function Panel({ variant = "default", className, children }: PanelProps) {
  return <div className={cn(VARIANTS[variant], className)}>{children}</div>;
}

interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <Panel variant="stat" className={cn("flex flex-col justify-end min-h-[100px]", className)}>
      <p className="type-stat">{value}</p>
      <p className="type-caption mt-1">{label}</p>
    </Panel>
  );
}

interface SurfaceCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function SurfaceCard({ className, children, hover }: SurfaceCardProps) {
  return (
    <div className={cn(hover ? "card-interactive p-4" : "card p-4", className)}>
      {children}
    </div>
  );
}
