"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signInWithEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/design/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useFormState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await signInWithEmail(formData)) ?? null;
    },
    null
  );

  return (
    <Card className="rounded-md">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to flex your collection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link
          href={`/auth/oauth?next=${encodeURIComponent(redirectTo ?? "/feed")}`}
          className="neo-btn bg-secondary text-secondary-foreground rounded-md h-11 px-5 text-sm w-full justify-center"
        >
          Continue with Google
        </Link>

        <p className="text-center text-xs font-bold text-muted-foreground">— or —</p>

        <form action={formAction} className="space-y-3">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          {state?.error && (
            <p className="text-sm font-bold text-destructive neo-border border-destructive bg-destructive/10 p-2 rounded-md">
              {state.error}
            </p>
          )}
          <SubmitButton />
        </form>

        <p className="text-center text-sm font-medium">
          No account?{" "}
          <Link href="/signup" className="font-black underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string; error?: string };
}) {
  const redirectTo = searchParams?.redirect;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        {searchParams?.error === "auth" && (
          <p className="text-sm font-bold text-destructive text-center neo-card border-destructive p-3 rounded-md">
            Authentication failed. Try again.
          </p>
        )}
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
