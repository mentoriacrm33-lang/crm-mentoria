import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Mentoria",
  description: "Gestão de mentorados, funil e sessões de mentoria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
