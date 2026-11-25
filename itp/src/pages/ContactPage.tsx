import { profile } from '../data/profile';
import { usePageMeta } from '../hooks/usePageMeta';
import { ExtLink, card } from '../components/ui';

export function ContactPage() {
  usePageMeta('Contact', 'Contact Arulmurugan S by email, phone, LinkedIn or GitHub.', '/contact');
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Contact</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Let’s connect</h1>
        <p className="mt-3 text-muted">
          Open to GenAI, Agentic AI, AIOps and infrastructure automation roles, and to AI and automation projects. Based in {profile.location}.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li className={card}>
          <h2 className="mb-1 text-lg font-semibold">Email</h2>
          <p className="mb-4 text-sm text-muted">For roles and project enquiries.</p>
          <a className="text-infra underline underline-offset-4 hover:text-fg" href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li className={card}>
          <h2 className="mb-1 text-lg font-semibold">Phone</h2>
          <p className="mb-4 text-sm text-muted">India, IST.</p>
          <a className="text-infra underline underline-offset-4 hover:text-fg" href={profile.phoneHref}>{profile.phone}</a>
        </li>
        <li className={card}>
          <h2 className="mb-1 text-lg font-semibold">LinkedIn</h2>
          <p className="mb-4 text-sm text-muted">Professional profile and messages.</p>
          <ExtLink href={profile.linkedin} variant="primary">Open LinkedIn</ExtLink>
        </li>
        <li className={card}>
          <h2 className="mb-1 text-lg font-semibold">GitHub</h2>
          <p className="mb-4 text-sm text-muted">Source code for my projects.</p>
          <ExtLink href={profile.github} variant="secondary">Open GitHub</ExtLink>
        </li>
      </ul>
    </div>
  );
}
