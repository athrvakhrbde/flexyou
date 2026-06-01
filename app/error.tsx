"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="neo-page text-center py-20">
      <div className="neo-card rounded-md p-8 max-w-md mx-auto">
        <h2 className="neo-heading text-2xl mb-2">Oops!</h2>
        <p className="text-sm font-medium text-muted-foreground mb-6">
          {error.message || "Something broke. Try again."}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={reset}>Try again</Button>
          <Link href="/feed">
            <Button variant="outline">Go to feed</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
