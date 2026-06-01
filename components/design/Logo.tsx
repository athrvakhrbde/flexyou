import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { box: "h-8 min-w-8 px-1 text-[10px]", text: "text-lg" },
  md: { box: "h-9 min-w-9 px-1 text-xs", text: "text-xl" },
  lg: { box: "h-11 min-w-11 px-1.5 text-sm", text: "text-2xl" },
};

export function Logo({ className, size = "md", href = "/feed" }: LogoProps) {
  const s = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-primary font-display font-bold text-primary-foreground neo-border shadow-neo-sm",
          s.box
        )}
      >
        FY
      </span>
      <span className={cn("font-display font-bold tracking-tight", s.text)}>FlexYou</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="neo-card-hover inline-block">
        {content}
      </Link>
    );
  }
  return content;
}
