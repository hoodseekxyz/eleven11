import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/pact")({ component: PactPage });

const QUOTE = "0x1bcD80A2E0Cc518B69AC12A939EF9AB1E094E704";
const DESK = "0x4Bf32aB828ECD792d8eBAba390365Bc26dA858DC";

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
        Robinhood Chain, id 4663. These are the quote and the desk. Neither one is the token. The token address still goes in the CA box, then bindToken once.
      </p>
      <div className="mt-8 grid gap-4">
        <AddressBox name="RestoreQuote" address={QUOTE} face="bg-paper" />
        <AddressBox name="RestoreDesk" address={DESK} face="bg-climb" />
      </div>
      <ol className="mt-8 grid gap-4">
        {RULES.map((rule, i) => (
          <li key={rule.title} className={`border-2 border-ink p-5 ${i === 2 ? "bg-loss text-paper" : "bg-paper"}`}>
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

function AddressBox({ name, address, face }: { name: string; address: string; face: string }) {
  const [note, setNote] = useState<string | null>(null);
  return (
    <article className={`border-2 border-ink p-5 ${face}`}>
      <p className="text-sm text-ink">{name}</p>
      <p className="mt-3 break-all font-serif text-xl leading-snug text-ink sm:text-2xl">{address}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="fun-btn bg-ink px-5 text-sm text-paper"
          onClick={async () => {
            await navigator.clipboard.writeText(address);
            setNote("Copied.");
          }}
        >
          Copy
        </button>
        <a
          className="fun-btn inline-flex items-center bg-paper px-5 text-sm text-ink"
          href={`https://robinhoodchain.blockscout.com/address/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          Explorer
        </a>
      </div>
      {note ? <p className="mt-3 text-sm text-ink">{note}</p> : null}
    </article>
  );
}
