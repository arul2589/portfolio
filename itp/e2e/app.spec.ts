import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

const routes = ['/', '/topology', '/projects', '/projects/graph-rag', '/experience', '/stack', '/infrastructure', '/contact'];

test.describe('routes', () => {
  for (const r of routes) {
    test(`direct load ${r} has no console/CSP errors`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(r);
      expect(res?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/nope');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/not found|404/i);
  });
  test('unknown project slug shows not found', async ({ page }) => {
    await page.goto('/projects/does-not-exist');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/not found|404/i);
  });
  test('refresh keeps route', async ({ page }) => {
    await page.goto('/experience');
    await page.reload();
    await expect(page).toHaveURL(/\/experience$/);
  });
  test('CloudArchitect case study is public and flags invite-only', async ({ page }) => {
    await page.goto('/projects/cloudarchitect');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('CloudArchitect Crew');
    await expect(page.getByText(/invite-only/i).first()).toBeVisible();
  });
  test('email and phone appear only on /contact, as owner-approved links', async ({ page }) => {
    for (const r of ['/', '/projects', '/experience']) {
      await page.goto(r);
      const html = await page.content();
      expect(html).not.toMatch(/mailto:|tel:/i);
    }
    await page.goto('/contact');
    await expect(page.getByRole('link', { name: 'arulmurugan@live.in' })).toHaveAttribute('href', 'mailto:arulmurugan@live.in');
    await expect(page.getByRole('link', { name: '+91 81246 81717' })).toHaveAttribute('href', 'tel:+918124681717');
  });
});

/** Wait until the graph has finished its initial fit so clicks land where the node is. */
async function settled(page: Page) {
  const probe = page.locator('[data-node-btn="core"]');
  await probe.waitFor();
  let prev = '';
  let stable = 0;
  for (let i = 0; i < 60 && stable < 5; i++) {
    const now = JSON.stringify(await probe.boundingBox()) + (await probe.evaluate((el) => el.closest('.react-flow__node')?.getAttribute('style')));
    stable = now === prev && now.includes('visibility: visible') ? stable + 1 : 0;
    prev = now;
    await page.waitForTimeout(100);
  }
}

test.describe('topology', () => {
  test('select cluster, expand, open detail, Escape closes and returns focus', async ({ page }) => {
    await page.goto('/topology');
    const graph = page.getByTestId('graph');
    await expect(graph).toBeVisible();
    await settled(page);
    const cluster = graph.getByRole('button', { name: /Projects/ }).first();
    await cluster.click();
    const item = graph.getByRole('button', { name: /Knowledge Graph RAG/ }).first();
    await expect(item).toBeVisible();
    await item.click();
    await expect(page.getByRole('heading', { name: 'Knowledge Graph RAG Assistant' })).toBeVisible();
    await expect(page).toHaveURL(/node=graph-rag/);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Knowledge Graph RAG Assistant' })).toHaveCount(0);
    await expect(page.locator('[data-node-btn="graph-rag"]')).toBeFocused();
  });
  test('filters change visible clusters and reset restores', async ({ page }) => {
    await page.goto('/topology');
    const graph = page.getByTestId('graph');
    await settled(page);
    await page.getByRole('button', { name: 'Networking', exact: true }).click();
    await expect(graph.getByRole('button', { name: /Networking/ }).first()).toBeVisible();
    await expect(graph.getByRole('button', { name: /Public contact/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(graph.getByRole('button', { name: /Public contact/ }).first()).toBeVisible();
  });
  test('valid deep link opens the node', async ({ page }) => {
    await page.goto('/topology?node=graph-rag');
    await expect(page.getByRole('heading', { name: 'Knowledge Graph RAG Assistant' })).toBeVisible();
  });
  test('invalid deep link falls back safely', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/topology?node=%3Cscript%3Ealert(1)%3C/script%3E');
    await expect(page.getByTestId('graph')).toBeVisible();
    await expect(page.getByRole('status')).toBeVisible();
    expect(errors).toEqual([]);
  });
  test('list view is reachable and shows clusters', async ({ page }) => {
    await page.goto('/topology');
    await page.getByRole('button', { name: /Show list/ }).click();
    await expect(page.getByText('GenAI & Agentic AI').first()).toBeVisible();
  });
  test('narrow screens default to list view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/topology');
    await expect(page.getByRole('button', { name: /Show graph/ })).toBeVisible();
  });
});

test.describe('responsive overflow', () => {
  for (const w of [360, 768, 1280]) {
    for (const r of routes) {
      test(`no horizontal overflow ${r} @${w}`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: 800 });
        await page.goto(r);
        await page.waitForLoadState('networkidle');
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(over).toBeLessThanOrEqual(1);
      });
    }
  }
});

test.describe('accessibility (axe WCAG 2.x A/AA)', () => {
  for (const r of ['/', '/topology', '/topology?node=graph-rag', '/projects', '/projects/graph-rag', '/experience', '/stack', '/infrastructure', '/contact']) {
    test(`axe ${r}`, async ({ page }) => {
      await page.goto(r);
      await page.waitForLoadState('networkidle');
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
});

test('security headers present', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  expect(h['content-security-policy']).toContain("default-src 'self'");
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options'] ?? h['content-security-policy']).toBeTruthy();
});
