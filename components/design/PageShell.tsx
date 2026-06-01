import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({ children, className, narrow }: PageShellProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 md:py-10",
        narrow && "max-w-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("section-spacing", className)}>
      {children}
    </section>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function PageSection({ children, className, containerClassName }: PageSectionProps) {
  return (
    <section className={cn("section-spacing", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
