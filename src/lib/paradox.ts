/** Percentage Paradox — a loss of rate r needs r/(1-r) to undo; a gain needs only r/(1+r) given back. */

export const BOOK_CAP = 12;
export const SHOCK_MIN = 1;
export const SHOCK_MAX = 80;

export type Quote = {
  shock: number;
  down: number;
  up: number;
  restore: number;
  giveback: number;
  gap: number;
};

export type Print = Quote & { id: string; principal: number; at: number };

export function quote(principal: number, shockPct: number): Quote {
  const r = clamp(shockPct, SHOCK_MIN, SHOCK_MAX) / 100;
  const restore = r / (1 - r);
  const giveback = r / (1 + r);
  return {
    shock: r,
    down: principal * (1 - r),
    up: principal * (1 + r),
    restore,
    giveback,
    gap: restore - giveback,
  };
}

export function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Insert a print. If the book is full, the smallest gap leaves. */
export function shelve(book: Print[], next: Print): { book: Print[]; displaced: Print | null } {
  if (book.length < BOOK_CAP) return { book: [next, ...book], displaced: null };
  let light = 0;
  for (let i = 1; i < book.length; i++) {
    if (book[i].gap < book[light].gap) light = i;
  }
  const displaced = book[light];
  const rest = book.filter((_, i) => i !== light);
  return { book: [next, ...rest], displaced };
}

export function pct(rate: number, digits = 2) {
  return `${(rate * 100).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function money(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function curve(steps = 80) {
  const rows: { shock: number; restore: number; giveback: number }[] = [];
  for (let i = 1; i <= steps; i++) {
    const q = quote(1, i);
    rows.push({
      shock: i,
      restore: q.restore * 100,
      giveback: q.giveback * 100,
    });
  }
  return rows;
}
