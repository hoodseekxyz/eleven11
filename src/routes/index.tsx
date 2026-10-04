import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BOOK_CAP, clamp, curve, money, pct, quote, shelve, SHOCK_MAX, SHOCK_MIN, type Print } from "@/lib/paradox";

export const Route = createFileRoute("/")({ component: Home });

const BOOK_KEY = "restore.book.v1";

function Home() {
  const [principal, setPrincipal] = useState(100);
  const [shock, setShock] = useState(10);
  const [book, setBook] = useState<Print[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(BOOK_KEY);
      if (raw) setBook(JSON.parse(raw) as Print[]);
    } catch { /* ignore a bad local book */ }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(BOOK_KEY, JSON.stringify(book));
  }, [book, mounted]);

  const q = useMemo(() => quote(principal, shock), [principal, shock]);
  const rows = useMemo(() => curve(), []);

  function print() {
    const next: Print = { ...quote(principal, shock), id: crypto.randomUUID(), principal, at: Date.now() };
    const result = shelve(book, next);
    setBook(result.book);
    setNote(result.displaced ? `Displaced a ${pct(result.displaced.shock, 0)} shock. The smallest gap left the book.` : null);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="grid gap-3 sm:grid-cols-5">
        <img
          src="/brand/logo.jpg"
          alt="Restore mark. A short black drop and a longer yellow climb."
          className="aspect-square w-full object-cover sm:col-span-2"
        />
        <img
          src="/brand/hero.jpg"
          alt="Twelve brass seats on a coral desk, with a steep yellow card and a short blue drop."
          className="aspect-video w-full object-cover sm:col-span-3 sm:aspect-auto sm:h-full"
        />
        <img
          src="/brand/cover.jpg"
          alt="Painted numerals. The walk back reads taller than the give-back."
          className="w-full object-cover sm:col-span-5"
        />
      </section>
      <header className="flex items-end justify-between gap-6 border-b border-rule pb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted">Desk</p>
          <h1 className="font-serif text-5xl font-medium leading-none text-ink">Restore</h1>
        </div>
        <p className="max-w-xs text-right text-sm leading-relaxed text-muted">
          A loss asks for more than it took. A gain gives less back.
        </p>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-5">
        <form className="lg:col-span-2" onSubmit={(e) => { e.preventDefault(); print(); }}>
          <label className="block text-sm text-muted" htmlFor="principal">Principal</label>
          <input
            id="principal"
            inputMode="decimal"
            className="mt-2 w-full border-b border-ink bg-transparent py-3 font-serif text-4xl text-ink outline-none"
            value={Number.isFinite(principal) ? principal : ""}
            onChange={(e) => setPrincipal(clamp(Number(e.target.value), 0.01, 1_000_000_000))}
          />

          <div className="mt-8 flex items-baseline justify-between">
            <label className="text-sm text-muted" htmlFor="shock">Shock</label>
            <span className="font-serif text-3xl text-loss">{shock}%</span>
          </div>
          <input
            id="shock"
            type="range"
            min={SHOCK_MIN}
            max={SHOCK_MAX}
            value={shock}
            onChange={(e) => setShock(Number(e.target.value))}
            className="mt-3 h-11 w-full accent-loss"
          />
          <div className="mt-3 flex gap-2">
            {[5, 10, 20, 50].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setShock(n)}
                className={`min-h-11 flex-1 border text-sm ${shock === n ? "border-ink bg-ink text-paper" : "border-rule bg-transparent text-ink"}`}
              >
                {n}%
              </button>
            ))}
          </div>

          <button type="submit" className="mt-8 min-h-11 w-full bg-ink px-4 py-3 text-sm text-paper">
            Print into the book
          </button>
          <p className="mt-3 text-sm text-muted">Twelve seats. A new print pushes out the smallest gap.</p>
          {note ? <p className="mt-2 text-sm text-loss">{note}</p> : null}
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          <Ledger
            kicker="After a fall"
            from={money(principal)}
            to={money(q.down)}
            label="Walk back"
            rate={pct(q.restore)}
            hot
          />
          <Ledger
            kicker="After a rise"
            from={money(principal)}
            to={money(q.up)}
            label="Give back"
            rate={pct(q.giveback)}
          />
          <div className="border border-rule p-5 sm:col-span-2">
            <p className="text-sm text-muted">The extra the fall demands</p>
            <p className="mt-2 font-serif text-5xl text-loss">{pct(q.gap)}</p>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
              Same shock, two directions. Undoing {shock}% down takes {pct(q.restore)}. Undoing {shock}% up only takes {pct(q.giveback)}. The gap is {pct(q.gap)}.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 border border-rule p-4 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">The two walks</h2>
          <p className="text-sm text-muted">Shock → percent to undo</p>
        </div>
        <div className="h-64">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#d8d0c4" vertical={false} />
                <XAxis dataKey="shock" tick={{ fill: "#6f675e", fontSize: 12 }} tickFormatter={(v) => `${v}`} />
                <YAxis tick={{ fill: "#6f675e", fontSize: 12 }} tickFormatter={(v) => `${v}%`} width={48} />
                <Tooltip
                  formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name === "restore" ? "Walk back" : "Give back"]}
                  labelFormatter={(label) => `${label}% shock`}
                  contentStyle={{ background: "#f3eee6", border: "1px solid #d8d0c4", borderRadius: 0 }}
                />
                <Line type="monotone" dataKey="restore" stroke="#9a3412" dot={false} strokeWidth={2} name="restore" />
                <Line type="monotone" dataKey="giveback" stroke="#1c1915" dot={false} strokeWidth={2} name="giveback" />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-full border border-rule" />}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl">Book</h2>
          <p className="text-sm text-muted">{book.length} / {BOOK_CAP}</p>
        </div>
        {book.length === 0 ? (
          <p className="py-8 text-sm text-muted">Empty. Print a shock to keep it on this desk.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {book.map((row) => (
              <li key={row.id} className="flex items-center gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{pct(row.shock, 0)} on {money(row.principal)}</p>
                  <p className="text-sm text-muted">Back {pct(row.restore)} · give {pct(row.giveback)}</p>
                </div>
                <p className="font-serif text-2xl text-loss">{pct(row.gap)}</p>
                <button
                  type="button"
                  className="min-h-11 px-3 text-sm text-muted"
                  onClick={() => setBook(book.filter((b) => b.id !== row.id))}
                >
                  Drop
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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

function Ledger({ kicker, from, to, label, rate, hot }: { kicker: string; from: string; to: string; label: string; rate: string; hot?: boolean }) {
  return (
    <article className="border border-rule p-5">
      <p className="text-sm text-muted">{kicker}</p>
      <p className="mt-3 font-serif text-3xl text-ink">{from} → {to}</p>
      <p className={`mt-4 text-sm ${hot ? "text-loss" : "text-ink"}`}>{label}</p>
      <p className={`font-serif text-4xl ${hot ? "text-loss" : "text-ink"}`}>{rate}</p>
    </article>
  );
}
