import fire from '../../config/fire-config';
import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  const fields = [
    {
      loc: 'https://vitaely.me', // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: 'https://www.vitaely.me/profile/ozIoHFEDeaa9zHPoaTsYStT51jK2', // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: 'https://www.vitaely.me/profile/5mRz950eTpVe6f3AswuUSgpPM4D3', // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    }
  ]

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default () => {}