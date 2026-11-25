import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function SectionHeading({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">{eyebrow}</p>
      )}
      <h2 id={id} className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'ai' | 'infra' | 'net' | 'exp' | 'ok' }) {
  const tones = {
    muted: 'border-line text-muted',
    ai: 'border-ai/50 text-ai',
    infra: 'border-infra/50 text-infra',
    net: 'border-net/50 text-net',
    exp: 'border-exp/50 text-exp',
    ok: 'border-ok/50 text-ok',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

const base =
  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2';
const variants = {
  primary: 'bg-ai text-bg hover:bg-[#b9a2fb]',
  secondary: 'border border-infra/60 text-infra hover:bg-infra/10',
  ghost: 'border border-line text-fg hover:border-muted',
};

export function LinkButton({
  to,
  variant = 'ghost',
  children,
}: {
  to: string;
  variant?: keyof typeof variants;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}

export function ExtLink({
  href,
  children,
  variant = 'ghost',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants | 'text';
  className?: string;
}) {
  const style = variant === 'text' ? 'text-infra underline underline-offset-4 hover:text-fg' : `${base} ${variants[variant]}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${style} ${className}`}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Chips({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-lg border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-fg">
          {t}
        </li>
      ))}
    </ul>
  );
}

export const card = 'rounded-2xl border border-line bg-surface p-6';
