import type { ReactNode } from "react";
import Link from "next/link";
import { Leaf, LayoutDashboard, Car, BarChart3, Wallet, FileText } from "lucide-react";
import { AppToaster } from "@/components/app-toaster";
import "./globals.css";

const links = [
  { href: "/", label: "Cruscotto", icon: LayoutDashboard, testid: "nav-dashboard" },
  { href: "/veicoli", label: "Veicoli", icon: Car, testid: "nav-veicoli" },
  { href: "/statistiche", label: "Statistiche", icon: BarChart3, testid: "nav-statistiche" },
  { href: "/costi", label: "Costi", icon: Wallet, testid: "nav-costi" },
  { href: "/report-isg", label: "Bilancio di sostenibilità", icon: FileText, testid: "nav-report" },
];

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-[#F8FAF8] text-slate-900">
        <AppToaster />
        <div className="grain-overlay min-h-screen">
          <header className="glass-nav sticky top-0 z-40 print:hidden border-b border-white/60 backdrop-blur-xl bg-white/75">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#1A4D2E] flex items-center justify-center shadow-sm">
                  <Leaf className="w-5 h-5 text-white" strokeWidth={2.4} />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-lg text-slate-900">GreenShift</div>
                  <div className="text-[11px] text-slate-500 -mt-0.5 font-medium tracking-wide uppercase">
                    Piattaforma per la sostenibilità della flotta
                  </div>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={link.testid}
                    className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                  data-testid="demo-badge"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Accesso demo
                </span>
              </div>
            </div>

            <div className="md:hidden border-t border-slate-200 bg-white/70 overflow-x-auto">
              <div className="flex gap-1 px-3 py-2 min-w-max">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap text-slate-600 hover:bg-slate-100"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>

          <footer className="mx-auto w-full max-w-7xl px-6 py-8 text-xs text-slate-500 print:hidden">
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>© {new Date().getFullYear()} GreenShift Mobility — Piattaforma per la gestione delle flotte sostenibili</div>
              <div className="font-mono text-[10px] text-slate-400">v1.0 · Conformità ESG</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}