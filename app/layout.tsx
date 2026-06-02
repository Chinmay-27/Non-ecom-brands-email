import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Campaign Viewer",
  description: "Browse generated lifecycle email campaigns per brand",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
