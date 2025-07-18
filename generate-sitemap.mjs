import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

const sitemap = new SitemapStream({ hostname: 'https://pitchintel.tech' });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
// Add more routes manually if needed
sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.7 });

sitemap.end();

const data = await streamToPromise(sitemap);
await writeFile(resolve('public', 'sitemap.xml'), data.toString());
