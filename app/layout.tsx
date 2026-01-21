import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendSense",
  description: "Upload your bank statement and get AI-powered spending insights",
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
        {children}
      </body>
    </html>
  );
}

