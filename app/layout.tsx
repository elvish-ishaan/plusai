import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import AuthProvider from "@/AuthProvider";
import { Toaster } from 'sonner'
import { ThemeProvider } from "@/components/providers/theme-provider";


export const metadata: Metadata = {
  title: "Plus AI – Universal AI Chat",
  description:
    "Plus AI is a powerful AI chat application that lets you connect with any LLM provider in one place. Chat seamlessly with GPT, Claude, Gemini, and more — all from a single app.",
  keywords: [
    "AI Chat",
    "LLM Chat",
    "GPT Chat",
    "Claude AI",
    "Gemini AI",
    "Chatbot App",
    "Plus AI",
    "AI Assistant",
    "AI Conversations",
    "Universal AI Chat",
  ],
  authors: [{ name: "Plus AI" }],
  creator: "Plus AI",
  // metadataBase: new URL("https://plusai.app"), // replace with your real domain
  // openGraph: {
  //   title: "Plus AI – Chat with Any LLM",
  //   description:
  //     "Chat with GPT, Claude, Gemini, and more — all from a single app. Experience universal AI conversations with Plus AI.",
  //   url: "https://plusai.app",
  //   siteName: "Plus AI",
  //   images: [
  //     {
  //       url: "https://plusai.app/og-image.png", // replace with your OG image
  //       width: 1200,
  //       height: 630,
  //       alt: "Plus AI – Universal AI Chat",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Plus AI – Universal AI Chat",
  //   description:
  //     "Seamlessly chat with GPT, Claude, Gemini, and other LLMs in one place with Plus AI.",
  //   images: ["https://plusai.app/og-image.png"], // same as OG
  //   creator: "@plusai", // replace with your handle
  // },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-spaceGrotesk"
})


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className}  antialiased bg-[radial-gradient(ellipse_at_center,var(--background)_20%,oklch(0.235_0.017_290)_100%)]`}
      >
        <Toaster />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
