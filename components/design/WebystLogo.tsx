import { cn } from "@/lib/utils";

interface WebystLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export function WebystLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: WebystLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn("h-4 w-4 shrink-0", iconClassName)}
        aria-hidden
      >
        <path d="M12 2l1.4 4.3L18 7l-3.5 2.5L16 14l-4-2.6L8 14l1.5-4.5L6 7l4.6-.7L12 2zm0 10.5l1.1 3.4 3.5-.5-2.7 2 1 3.4-2.9-2-2.9 2 1-3.4-2.7-2 3.5.5L12 12.5z" />
      </svg>
      {showText && (
        <span className={cn("font-bold tracking-tight", textClassName)}>FlexYou</span>
      )}
    </span>
  );
}
