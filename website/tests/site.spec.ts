import { expect, test, type Page } from '@playwright/test';

/** Page object for the docs site - keeps the specs readable. */
class SitePage {
  constructor(private readonly page: Page) {}

  async gotoHome(): Promise<void> {
    await this.page.goto('./');
  }

  async gotoDoc(slug: string): Promise<void> {
    await this.page.goto(`./docs/${slug}`);
  }

  /** Opens the mobile hamburger menu if it is shown (phones only). */
  async openMobileMenuIfPresent(): Promise<void> {
    const toggle = this.page.getByRole('button', { name: /toggle navigation bar/i });
    if (await toggle.isVisible()) await toggle.click();
  }

  heading(name: string | RegExp) {
    return this.page.getByRole('heading', { level: 1, name });
  }
}

const MODULES = [
  { slug: 'modules/devsecops', title: /Module 1/ },
  { slug: 'modules/api-security', title: /Module 2/ },
  { slug: 'modules/cloud-integration', title: /Module 3/ },
];

test('home page shows the workshop and links to every module', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoHome();
  await expect(site.heading(/API Workshop/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Start the workshop/ })).toBeVisible();
  for (const label of ['DevSecOps', 'API Security', 'Cloud Integration']) {
    await expect(page.getByRole('main').getByRole('link', { name: new RegExp(label) })).toBeVisible();
  }
});

test('"Start the workshop" opens the agenda', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoHome();
  await page.getByRole('link', { name: /Start the workshop/ }).click();
  await expect(site.heading(/Workshop Agenda/)).toBeVisible();
});

for (const mod of MODULES) {
  test(`renders ${mod.slug}`, async ({ page }) => {
    const site = new SitePage(page);
    await site.gotoDoc(mod.slug);
    await expect(site.heading(mod.title)).toBeVisible();
  });
}

test('navigation menu reaches the handout (hamburger on mobile)', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoHome();
  await site.openMobileMenuIfPresent();
  await page.getByRole('link', { name: 'Handout', exact: true }).first().click();
  await expect(site.heading(/Audience Handout/)).toBeVisible();
});

test('Module 1 renders its Mermaid DevSecOps diagram', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoDoc('modules/devsecops');
  const diagrams = page.locator('.docusaurus-mermaid-container svg');
  await expect(diagrams.first()).toBeVisible();
  await expect(diagrams.first().getByText(/Developer Push/)).toBeVisible();
});

test('Module 3 renders its Mermaid Cloud architecture diagram', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoDoc('modules/cloud-integration');
  const diagrams = page.locator('.docusaurus-mermaid-container svg');
  await expect(diagrams.first()).toBeVisible();
  await expect(diagrams.first().getByText(/API Gateway/)).toBeVisible();
});

test('links to demo source code point to GitHub', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoDoc('modules/cloud-integration');
  const link = page.getByRole('main').getByRole('link', { name: 'demo/Dockerfile' }).first();
  await expect(link).toHaveAttribute('href', /github\.com\/.+\/blob\/main\/demo\/Dockerfile$/);
});

test('handout quiz answers are collapsible', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoDoc('audience-handout');
  await expect(page.getByText('Click to view answers', { exact: true })).toBeVisible();
});

test('page does not scroll horizontally on small screens', async ({ page }) => {
  const site = new SitePage(page);
  await site.gotoDoc('agenda');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
