import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const LINKS = [
  { to: "/", label: "Desk", face: "bg-ink text-paper" },
  { to: "/how", label: "How", face: "bg-loss text-paper" },
  { to: "/ca", label: "CA", face: "bg-climb text-ink" },
  { to: "/pact", label: "Pact", face: "bg-paper text-ink" },
] as const;

export function SiteFrame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Pages">
        {LINKS.map((link) => {
          const on = path === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`fun-btn flex items-center justify-center px-3 text-sm ${link.face} ${on ? "translate-y-0.5" : "opacity-80"}`}
              aria-current={on ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      {children}
      <footer className="mt-16 border-t border-rule pt-6 text-sm leading-relaxed text-muted">
        <p>
          Restore quotes a ratio. It does not hold funds, pay interest, or trade a stock.
          The identity is the Percentage Paradox, an essay by Him Gajria, 6 May 2023. This desk is not his, and it is not Equation.
        </p>
        <p className="mt-3">
          Not affiliated with Hims & Hers, Robinhood, or any token using their names.
          A stock pair is a quote someone else chooses. This page does not deploy one.
          eleven11.lol
        </p>
      </footer>
    </main>
  );
}
