import Link from "next/link";
import { Logo } from "@/components/design/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Logo size="sm" />
            <p className="type-body-sm mt-3 max-w-xs">
              Showcase what you own. Inspire what they want.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Product</p>
              <Link href="/feed" className="block text-muted-foreground hover:text-primary transition-colors">Feed</Link>
              <Link href="/signup" className="block text-muted-foreground hover:text-primary transition-colors">Sign up</Link>
            </div>
            <div className="space-y-2.5">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Account</p>
              <Link href="/login" className="block text-muted-foreground hover:text-primary transition-colors">Log in</Link>
            </div>
          </div>
        </div>
        <p className="type-caption mt-10 pt-6 border-t border-border">
          © {new Date().getFullYear()} FlexYou. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
