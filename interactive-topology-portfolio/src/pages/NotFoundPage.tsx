import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found', 'This page does not exist.', '/');
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-err">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist or has moved.</p>
      <ul className="mt-6 flex flex-wrap gap-4 text-infra">
        <li><Link className="underline underline-offset-4" to="/">Home</Link></li>
        <li><Link className="underline underline-offset-4" to="/projects">Projects</Link></li>
        <li><Link className="underline underline-offset-4" to="/topology">Topology</Link></li>
      </ul>
    </div>
  );
}
