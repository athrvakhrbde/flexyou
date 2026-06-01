export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Link href="/feed" className="neo-chip rounded-md inline-flex">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Link>
      <div className="neo-card rounded-md p-6">
        <h1 className="neo-heading text-2xl">Settings</h1>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Profile editing and preferences coming soon.
        </p>
      </div>
    </div>
  );
}
