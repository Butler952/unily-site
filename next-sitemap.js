module.exports = {
  siteUrl: process.env.SITE_URL || 'https://vitaely.me',
  generateRobotsTxt: true, // (optional)
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://vitaely.me/server-sitemap.xml', // <==== Add here
    ],
  },
}