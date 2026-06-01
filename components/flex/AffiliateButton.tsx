"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackAffiliateClick } from "@/lib/actions/storage";
import { getAffiliatePlatform } from "@/lib/utils/format";

interface AffiliateButtonProps {
  affiliateLink: string;
  flexItemId: string;
  className?: string;
  variant?: "default" | "accent" | "secondary";
}

export function AffiliateButton({ affiliateLink, flexItemId, className, variant = "secondary" }: AffiliateButtonProps) {
  const platform = getAffiliatePlatform(affiliateLink);
  const label =
    platform === "amazon"
      ? "Buy Similar on Amazon"
      : platform === "flipkart"
        ? "Buy Similar on Flipkart"
        : "Buy Similar";

  const handleClick = async () => {
    await trackAffiliateClick(flexItemId);
    window.open(affiliateLink, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size="lg"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
