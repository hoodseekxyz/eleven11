import { createFileRoute } from "@tanstack/react-router";
import { CaBanner } from "@/components/ca-banner";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/ca")({ component: CaPage });

function CaPage() {
  return (
    <SiteFrame>
      <header className="mt-8 border-b border-rule pb-6">
        <p className="text-sm uppercase tracking-widest text-muted">CA</p>
        <h1 className="font-serif text-5xl font-medium leading-none text-ink">The box</h1>
      </header>
      <CaBanner />
      <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
        This is the token, not RestoreDesk. After it is deployed on long.xyz, the same address is bound once. The quote contract holds nothing.
      </p>
    </SiteFrame>
  );
}
