module.exports = {
  siteUrl: process.env.SITE_URL || 'https://expertpage.io',
  generateRobotsTxt: true, // (optional)
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://expertpage.io/server-sitemap.xml', // <==== Add here
    ],
  },
}