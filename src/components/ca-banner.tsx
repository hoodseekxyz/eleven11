import { useState } from "react";
import { TOKEN_CA, TOKEN_NAME, TOKEN_TICKER } from "@/lib/token";

export function CaBanner() {
  const [note, setNote] = useState<string | null>(null);
  const ca = TOKEN_CA;

  return (
    <section className="mt-6 border-2 border-ink bg-climb p-5" aria-label="Token address">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-ink">CA · {TOKEN_TICKER}</p>
        <p className="text-sm text-ink">{TOKEN_NAME}</p>
      </div>
      <p className="mt-3 break-all font-serif text-3xl leading-tight text-ink sm:text-5xl">
        {ca || "No address yet"}
      </p>
      <button
        type="button"
        className="fun-btn mt-5 bg-ink px-5 text-sm text-paper"
        disabled={!ca}
        onClick={async () => {
          await navigator.clipboard.writeText(ca);
          setNote("Copied.");
        }}
      >
        Copy
      </button>
      {note ? <p className="mt-3 text-sm text-ink">{note}</p> : null}
    </section>
  );
}
