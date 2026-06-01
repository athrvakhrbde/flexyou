import { Navbar } from "./Navbar";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    username: string;
    avatar: string | null;
    displayName: string | null;
  } | null;
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="neo-page">{children}</main>
    </div>
  );
}
