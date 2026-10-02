import type { Metadata } from "next";
import "./globals.css";
import "./editorial-article.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Agency Privé — The Global Agency Directory", template: "%s | Agency Privé" },
  description: "Discover, compare, and connect with independently reviewed creator and talent-management agencies worldwide.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
