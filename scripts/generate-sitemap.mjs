import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const config = JSON.parse(await readFile(resolve(root, 'seo.config.json'), 'utf8'));
const agencies = JSON.parse(await readFile(resolve(root, 'data/approved-agencies.json'), 'utf8'));
const articles = JSON.parse(await readFile(resolve(root, 'data/published-articles.json'), 'utf8'));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const cleanBase = String(config.siteUrl).replace(/\/$/, '');

if (!/^https:\/\//.test(cleanBase)) throw new Error('seo.config.json siteUrl must use HTTPS.');
if (!Array.isArray(agencies) || !Array.isArray(articles)) throw new Error('Public data files must contain JSON arrays.');

const urls = new Map();
const add = (path, lastmod, priority, changefreq) => {
  const location = new URL(path, `${cleanBase}/`).href;
  urls.set(location, { location, lastmod, priority, changefreq });
};

add('/', null, '1.0', 'weekly');
add('/agencies', null, '0.9', 'daily');
add('/compare', null, '0.7', 'weekly');
add('/rankings', null, '0.7', 'weekly');
add('/reviews', null, '0.6', 'monthly');
add('/insights', null, '0.8', 'weekly');
add('/for-agencies', null, '0.7', 'monthly');

const approved = agencies.filter(item => item && item.status === 'approved' && item.published === true && slugPattern.test(String(item.slug || '')));
for (const agency of approved) {
  add(`/agencies/${agency.slug}`, agency.updatedAt || agency.approvedAt || null, '0.8', 'weekly');
  const facets = [['country', agency.country], ['category', agency.category]];
  for (const [type, value] of facets) if (slugPattern.test(String(value?.slug || ''))) add(`/agencies/${type}/${value.slug}`, null, '0.6', 'weekly');
  for (const service of Array.isArray(agency.services) ? agency.services : []) if (slugPattern.test(String(service?.slug || ''))) add(`/agencies/service/${service.slug}`, null, '0.6', 'weekly');
}

const published = articles.filter(item => item && item.status === 'published' && slugPattern.test(String(item.slug || '')) && item.title && item.publishedDate);
for (const article of published) add(`/insights/${article.slug}`, article.modifiedDate || article.publishedDate, '0.7', 'monthly');

const xmlEscape = value => String(value).replace(/[<>&'\"]/g, character => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','\"':'&quot;'}[character]));
const validDate = value => { const time=Date.parse(value || ''); return Number.isFinite(time) ? new Date(time).toISOString().slice(0,10) : null; };
const entries = [...urls.values()].sort((a,b) => a.location.localeCompare(b.location)).map(item => {
  const date = validDate(item.lastmod);
  return `  <url>\n    <loc>${xmlEscape(item.location)}</loc>${date ? `\n    <lastmod>${date}</lastmod>` : ''}\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`;
}).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
await writeFile(resolve(root, 'sitemap.xml'), sitemap);
console.log(`Generated sitemap.xml with ${urls.size} canonical URLs (${approved.length} approved agencies, ${published.length} published articles).`);
