"use client";

import { useFormState } from "react-dom";
import { completeOnboarding } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_CATEGORIES, CategoryIcon } from "@/components/flex/CategoryIcon";
import { CATEGORY_LABELS } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "@/components/design/Logo";

function OnboardingForm() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [state, formAction] = useFormState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      selectedInterests.forEach((i) => formData.append("interests", i));
      return (await completeOnboarding(formData)) ?? null;
    },
    null
  );

  const toggleInterest = (category: string) => {
    setSelectedInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : prev.length < 5
          ? [...prev, category]
          : prev
    );
  };

  return (
    <Card className="rounded-md">
      <CardHeader className="text-center">
        <CardTitle>Your profile</CardTitle>
        <CardDescription>Quick setup — under a minute</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Username</label>
            <Input name="username" placeholder="yourname" required pattern="[a-z0-9_]{3,20}" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Display name</label>
            <Input name="displayName" placeholder="Your Name" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Bio</label>
            <Input name="bio" placeholder="What do you flex?" maxLength={160} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Location</label>
            <Input name="location" placeholder="City, Country" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Interests (max 5)</label>
            <div className="grid grid-cols-3 gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleInterest(cat)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-md text-[10px] font-bold neo-border shadow-neo-sm transition-all",
                    selectedInterests.includes(cat)
                      ? "bg-primary text-primary-foreground shadow-neo"
                      : "bg-card hover:-translate-x-px hover:-translate-y-px"
                  )}
                >
                  <CategoryIcon category={cat} size={16} />
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
          {state?.error && (
            <p className="text-sm font-bold text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={selectedInterests.length === 0}>
            Done
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
