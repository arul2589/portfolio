import { experience, certifications, education } from '../../data/experience';
import { Badge, card } from '../../components/ui';

export function Timeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="relative ml-3 border-l-2 border-line">
      {experience.map((e) => (
        <li key={e.id} className="relative pb-8 pl-8 last:pb-0">
          <span aria-hidden="true" className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-[3px] border-bg bg-exp" />
          <p className="font-mono text-xs text-exp">{e.period}</p>
          <h3 className="mt-1 text-lg font-semibold text-fg">{e.title}</h3>
          <p className="text-sm text-muted">{e.org}</p>
          {!compact && (
            <>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted marker:text-exp">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {e.note && <p className="mt-3 text-sm italic text-muted">{e.note}</p>}
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

export function Credentials() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className={card} aria-labelledby="certs-h">
        <h3 id="certs-h" className="mb-4 text-lg font-semibold">Certifications</h3>
        <ul className="space-y-3 text-sm">
          {certifications.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-3 last:border-0 last:pb-0">
              <span className="max-w-[28rem] text-fg">{c.label}</span>
              <span className="flex items-center gap-2">
                {'year' in c && <span className="font-mono text-xs text-muted">{c.year}</span>}
                {c.status === 'expired' && <Badge>Expired</Badge>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className={card} aria-labelledby="edu-h">
        <h3 id="edu-h" className="mb-4 text-lg font-semibold">Education</h3>
        <p className="font-medium text-fg">{education.degree}</p>
        <p className="mt-1 text-sm text-muted">{education.school}</p>
      </section>
    </div>
  );
}
