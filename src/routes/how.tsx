import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/how")({ component: HowPage });

function HowPage() {
  return (
    <SiteFrame>
      <header className="mt-8 border-b border-rule pb-6">
        <p className="text-sm uppercase tracking-widest text-muted">How</p>
        <h1 className="font-serif text-5xl font-medium leading-none text-ink">Three moves</h1>
      </header>
      <img
        src="/brand/split.jpg"
        alt="A short blue drop beside a longer yellow and magenta climb."
        className="mt-6 w-full border-2 border-ink object-cover"
      />
      <ol className="mt-8 grid gap-4">
        <li className="border-2 border-ink bg-paper p-5">
          <p className="font-serif text-4xl text-ink">1</p>
          <h2 className="mt-2 text-sm text-ink">Set one shock</h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
            A principal, and one percent. The same shock is applied down and up. Nothing else is an input.
          </p>
        </li>
        <li className="border-2 border-ink bg-loss p-5 text-paper">
          <p className="font-serif text-4xl">2</p>
          <h2 className="mt-2 text-sm">Read both prices</h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed">
            A fall of r needs r / (1 − r) to come home. A rise of r gives the gain back at r / (1 + r). The gap is what the fall charges extra.
          </p>
        </li>
        <li className="border-2 border-ink bg-climb p-5">
          <p className="font-serif text-4xl text-ink">3</p>
          <h2 className="mt-2 text-sm text-ink">Print the seat</h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            The book holds twelve. A thirteenth print pushes out the smallest gap. Drop removes a seat by hand. The desk holds no funds.
          </p>
        </li>
      </ol>
      <p className="mt-8 max-w-prose text-sm leading-relaxed text-muted">
        At 10% on 100, the fall lands at 90 and the walk back is 11.11%. The rise lands at 110 and the give-back is 9.09%. Same shock. Two prices. Gap, 2.02 points.
      </p>
      <Link to="/" className="fun-btn mt-8 inline-flex items-center bg-ink px-5 text-sm text-paper">
        Back to the desk
      </Link>
    </SiteFrame>
  );
}
