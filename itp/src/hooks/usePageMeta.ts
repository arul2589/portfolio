import { useEffect } from 'react';
import { profile } from '../data/profile';

const setMeta = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

/** Unique title, description and canonical URL for each route. */
export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title === profile.name ? `${profile.name} · ${profile.headline}` : `${title} · ${profile.name}`;
    setMeta('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), 'content', description);
    setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', `${profile.siteUrl}${path}`);
    setMeta('meta[property="og:url"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); return m; }, 'content', `${profile.siteUrl}${path}`);
  }, [title, description, path]);
}
