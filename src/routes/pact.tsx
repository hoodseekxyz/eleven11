import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/pact")({ component: PactPage });

const RULES = [
  { kicker: "Quote", title: "quote(1000)", body: "10% is 1,000 basis points. The walk back comes back 1,111. The give-back comes back 909. The gap is 202." },
  { kicker: "Desk", title: "Twelve seats", body: "A print costs 0.0001 ETH, exactly. That ether stays in the contract. There is no withdraw." },
  { kicker: "Bind", title: "Once", body: "Deploy the token on long.xyz first. Then call bindToken with that address. It cannot be changed." },
];

function PactPage() {
  return (
    <SiteFrame>
      <header className="mt-8 border-b border-rule pb-6">
        <p className="text-sm uppercase tracking-widest text-muted">Pact</p>
        <h1 className="font-serif text-5xl font-medium leading-none text-ink">Two contracts</h1>
      </header>
      <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted">
        Remix, compiler 0.8.24, optimizer 200. Paste each file alone. Neither contract mints the token or holds a stock.
      </p>
      <ol className="mt-8 grid gap-4">
        {RULES.map((rule, i) => (
          <li key={rule.title} className={`border-2 border-ink p-5 ${i === 1 ? "bg-climb" : i === 2 ? "bg-loss text-paper" : "bg-paper"}`}>
            <p className="text-sm">{rule.kicker}</p>
            <h2 className="mt-2 font-serif text-3xl">{rule.title}</h2>
            <p className="mt-2 max-w-prose text-sm leading-relaxed">{rule.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/ca" className="fun-btn inline-flex items-center bg-climb px-5 text-sm text-ink">Open the CA box</Link>
        <Link to="/how" className="fun-btn inline-flex items-center bg-loss px-5 text-sm text-paper">Read the how</Link>
      </div>
    </SiteFrame>
  );
}
