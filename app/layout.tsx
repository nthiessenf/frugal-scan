import type { Metadata } from "next";
import "./globals.css";
import { AnalysisProvider } from '@/contexts/AnalysisContext';

export const metadata: Metadata = {
  title: 'SpendSense - AI-Powered Spending Insights',
  description: 'Upload your bank statement and get instant AI-powered insights into your spending habits. Free, private, no account linking required.',
  keywords: ['spending tracker', 'budget analysis', 'personal finance', 'AI finance', 'bank statement analyzer'],
  authors: [{ name: 'SpendSense' }],
  openGraph: {
    title: 'SpendSense - See Where Your Money Really Goes',
    description: 'Upload your bank statement and get AI-powered spending insights in 60 seconds.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendSense - AI Spending Insights',
    description: 'Upload your bank statement and get AI-powered spending insights in 60 seconds.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
          background: `
            radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(251, 207, 232, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(196, 181, 253, 0.08) 0%, transparent 50%),
            #f5f5f7
          `,
          minHeight: "100vh",
        }}
      >
        <AnalysisProvider>
          {children}
        </AnalysisProvider>
      </body>
    </html>
  );
}

