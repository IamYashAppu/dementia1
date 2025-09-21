import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { AccessibilityPanel } from '@/components/AccessibilityPanel'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: "Cogni Health - AI-Powered Cognitive Health Screening",
  description: "Early detection of cognitive changes through advanced AI analysis of speech, behavior, and cognitive patterns. Simple, accessible, and designed for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <AccessibilityProvider>
            {children}
            <AccessibilityPanel />
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
