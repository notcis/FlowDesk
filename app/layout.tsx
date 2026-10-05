import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/lib/constants";
import { QueryProvider } from "@/components/shared/query-provider";
import { RoleProvider } from "@/components/shared/role-context";
import { DashboardShell } from "@/components/layouts/dashboard-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: `${APP_CONFIG.name} — ${APP_CONFIG.description}`,
  },
  description: APP_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        <QueryProvider>
          <RoleProvider>
            <DashboardShell>{children}</DashboardShell>
          </RoleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
