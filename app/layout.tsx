import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import "./globals.css";
import { getNav } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import StoreInit from "@/components/StoreInit";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Estudo guiado: Linux, Java, Kotlin, OOP, Algoritmos, SQL e Android nativo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = getNav();
  return (
    <html lang="pt-BR">
      <body>
        <StoreInit />
        <div className="shell">
          <Sidebar nav={nav} />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
