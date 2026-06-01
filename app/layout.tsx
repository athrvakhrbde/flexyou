import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClientAppShell } from "@/components/layout/ClientAppShell";
import { getCurrentUser } from "@/lib/actions/auth";
import { getAppUrl } from "@/lib/utils/app-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceGroteskDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

export const metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "FlexYou — Flex What You Own",
    template: "%s · FlexYou",
  },
  description: "Show off your personal collections and everyday carry items.",
  openGraph: {
    title: "FlexYou",
    description: "Flex what you own. Discover collections from collectors worldwide.",
    siteName: "FlexYou",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${spaceGroteskDisplay.variable} font-sans`}>
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              <ClientAppShell user={user}>{children}</ClientAppShell>
              <Toaster richColors position="bottom-right" />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
