import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8 md:mb-10", className)}>
      {eyebrow && <p className="type-label mb-2">{eyebrow}</p>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="type-h1">{title}</h1>
          {description && <p className="type-body mt-2 max-w-xl">{description}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="type-h2">{title}</h2>
        {description && <p className="type-body-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
