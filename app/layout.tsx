import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Montserrat } from "next/font/google";
import AuthProvider from "@/AuthProvider";
import { Toaster } from 'sonner'


export const metadata: Metadata = {
  title: "Plus AI",
  description: "Modern AI-powered chat application with multiple LLM providers",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.className}  antialiased min-h-screen bg-[radial-gradient(ellipse_at_center,var(--background)_20%,oklch(0.235_0.017_290)_100%)]`}
      >
        <Toaster />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
