"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signUpWithEmail } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/design/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating..." : "Create account"}
    </Button>
  );
}

function SignupForm() {
  const [state, formAction] = useFormState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await signUpWithEmail(formData)) ?? null;
    },
    null
  );

  return (
    <Card className="rounded-md">
      <CardHeader className="text-center">
        <CardTitle>Start flexing</CardTitle>
        <CardDescription>Create your FlexYou account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link
          href="/auth/oauth?next=%2Fonboarding"
          className="neo-btn bg-accent text-accent-foreground rounded-md h-11 px-5 text-sm w-full justify-center"
        >
          Continue with Google
        </Link>
        <p className="text-center text-xs font-bold text-muted-foreground">— or —</p>
        <form action={formAction} className="space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" minLength={6} required />
          <Input name="confirmPassword" type="password" placeholder="Confirm password" minLength={6} required />
          {state?.error && (
            <p className="text-sm font-bold text-destructive p-2 neo-border border-destructive rounded-md">{state.error}</p>
          )}
          <SubmitButton />
        </form>
        <p className="text-center text-sm font-medium">
          Have an account?{" "}
          <Link href="/login" className="font-black underline underline-offset-4">Log in</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
