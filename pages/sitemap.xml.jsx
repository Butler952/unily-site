const toUrl = (host, route, frequency, priority) => (
  `
  <url>
    <loc>https://${host}${route}</loc>
    <changefreq>${frequency ? frequency : "weekly"}</changefreq>
    <priority>${priority ? priority : "0.7"}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  `
)

const createSitemap = (
  host,
  routes,
  legals,
  users,
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map((route) => toUrl(host, `/${route}`, `weekly`, `1.0`)).join("")}
    ${users.map((user) => toUrl(host, `/users/${user}`, `monthly`, `0.6`)).join("")}
    ${legals.map((legal) => toUrl(host, `/legal/${legal}`, `monthly`)).join("")}
    </urlset>`;

const Sitemap = () => {};


Sitemap.getInitialProps = ({ res, req }) => {
  const routes = [
    "names",
    "shortlist",
    "settings",
    "store",
  ];
  const legals = ["cookies", "privacy", "terms"];  //You can fetch the products from an API
  const users = ["login", "register"];  //You can fetch the products from an API
  
  const sitemap = createSitemap(req.headers.host, routes, legals, users);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return res;
};

export default Sitemap;