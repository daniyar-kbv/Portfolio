export async function GET({ site }: { site?: URL }) {
  const sitemapUrl = new URL('/sitemap-index.xml', site ?? 'http://localhost:4321').toString();

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
