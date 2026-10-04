import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/ca")({ component: CaPage });

const CA_KEY = "restore.ca.v1";
const CA_RE = /^0x[a-fA-F0-9]{40}$/;

function CaPage() {
  const [ca, setCa] = useState("");
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CA_KEY) ?? "";
    setCa(saved);
    setDraft(saved);
    setReady(true);
  }, []);

  function save(event: FormEvent) {
    event.preventDefault();
    const next = draft.trim();
    if (!CA_RE.test(next)) {
      setNote("That is not an address. It needs 0x and 40 hex characters.");
      return;
    }
    localStorage.setItem(CA_KEY, next);
    setCa(next);
    setNote("Saved on this browser.");
  }

  async function copy() {
    if (!ca) return;
    await navigator.clipboard.writeText(ca);
    setNote("Copied.");
  }

  function clear() {
    localStorage.removeItem(CA_KEY);
    setCa("");
    setDraft("");
    setNote("Cleared.");
  }

  return (
    <SiteFrame>
      <header className="mt-8 border-b border-rule pb-6">
        <p className="text-sm uppercase tracking-widest text-muted">CA</p>
        <h1 className="font-serif text-5xl font-medium leading-none text-ink">The box</h1>
      </header>

      <section className="mt-8 border-2 border-ink bg-climb p-5">
        <p className="text-sm text-ink">Address</p>
        <p className="mt-3 break-all font-serif text-2xl leading-snug text-ink sm:text-4xl">
          {ready ? (ca || "No address yet") : "…"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="fun-btn bg-ink px-5 text-sm text-paper" onClick={copy} disabled={!ca}>
            Copy
          </button>
          <button type="button" className="fun-btn bg-paper px-5 text-sm text-ink" onClick={clear} disabled={!ca}>
            Clear
          </button>
        </div>
      </section>

      <form className="mt-8" onSubmit={save}>
        <label className="block text-sm text-muted" htmlFor="draft">Paste the token address after you deploy it</label>
        <input
          id="draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 font-serif text-2xl text-ink outline-none"
          placeholder="0x"
        />
        <button type="submit" className="fun-btn mt-6 bg-loss px-5 text-sm text-paper">
          Save address
        </button>
        {note ? <p className="mt-3 text-sm text-ink">{note}</p> : null}
      </form>

      <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
        This page does not invent an address. Deploy the token on long.xyz, then paste it here. Bind that same address once in RestoreDesk. The quote contract is separate and holds nothing.
      </p>
    </SiteFrame>
  );
}
