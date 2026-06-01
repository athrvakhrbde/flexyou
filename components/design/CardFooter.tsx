import { WebystLogo } from "./WebystLogo";
import { cn } from "@/lib/utils";

interface CardFooterProps {
  href?: string;
  className?: string;
}

export function CardFooter({ href = "flexyou.com", className }: CardFooterProps) {
  return (
    <div className={cn("flex items-center justify-between pt-4 mt-auto", className)}>
      <WebystLogo textClassName="text-sm" />
      <span className="text-xs text-muted-foreground">{href}</span>
    </div>
  );
}
