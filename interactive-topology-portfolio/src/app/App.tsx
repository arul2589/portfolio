import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { ExtLink } from '../components/ui';
import { NeuralBackground } from '../components/NeuralBackground';
import { Home } from '../pages/Home';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { StackPage } from '../pages/StackPage';
import { InfrastructurePage } from '../pages/InfrastructurePage';
import { ContactPage } from '../pages/ContactPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const TopologyPage = lazy(() => import('../features/topology/TopologyPage'));

const nav = [
  { to: '/projects', label: 'Projects' },
  { to: '/topology', label: 'Topology' },
  { to: '/experience', label: 'Experience' },
  { to: '/stack', label: 'Stack' },
  { to: '/contact', label: 'Contact' },
];

function Shell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Move focus to the page content after client-side navigation.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {pathname !== '/topology' && <NeuralBackground />}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 sm:px-6">
          <Link to="/" className="font-mono text-xl font-bold tracking-tight text-fg" aria-label={`${profile.shortName}. ${profile.name}, home`}>
            {profile.shortName}<span className="text-infra">.</span>
          </Link>
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `py-1.5 transition-colors hover:text-fg ${isActive ? 'border-b-2 border-infra text-fg' : 'text-muted'}`
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" ref={main} tabIndex={-1}>
        {children}
      </main>

      <footer className="mt-24 border-t border-line text-sm text-muted">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="flex gap-5">
            <ExtLink href={profile.github} variant="text">GitHub</ExtLink>
            <ExtLink href={profile.linkedin} variant="text">LinkedIn</ExtLink>
          </span>
        </div>
      </footer>
    </>
  );
}

export function App() {
  return (
    <Shell>
      <Suspense fallback={<p className="mx-auto max-w-7xl px-6 py-24 text-muted" role="status">Loading the topology…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topology" element={<TopologyPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Shell>
  );
}
