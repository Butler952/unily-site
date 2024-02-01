import { useState, useEffect } from 'react';
import fire from '../config/fire-config';

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
  blogs,
  profiles,
  premiumProfiles
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map((route) => toUrl(host, `/${route}`, `weekly`, `1.0`)).join("")}
    ${blogs.map((post) => toUrl(host, `/blog${post}`, `yearly`, `0.8`)).join("")}
    ${users.map((user) => toUrl(host, `/users/${user}`, `monthly`, `0.6`)).join("")}
    ${profiles.map((profile) => toUrl(host, `/profile/${profile}`, `monthly`, `0.8`)).join("")}
    ${premiumProfiles.map((profile) => toUrl(host, `/${profile}`, `monthly`, `0.8`)).join("")}
    ${legals.map((legal) => toUrl(host, `/legal/${legal}`, `monthly`)).join("")}
    </urlset>`;

const Sitemap = () => {};

// ${profiles.map((profile) => toUrl(host, `/profile/${profile}`, `daily`, `0.8`)).join("")}

/*export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const profilesRes = await fetch("/api/getProfilelist")
  const profiles = await profilesRes.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      profiles,
    },
  }
}*/

Sitemap.getInitialProps = ({ res, req }) => {
  const routes = [
    "", 
    "pricing",
    "templates",
    "online-cv-builder", 
    "online-resume-builder", 
    "pdf-resume-builder", 
    "linkedin-to-resume"
  ];
  const legals = ["cookies", "privacy", "terms"];  //You can fetch the products from an API
  const users = ["login", "register", "reset"];  //You can fetch the products from an API
  const blogs = [
    "",
    "/how-to-create-an-online-cv",
    "/how-to-create-a-personal-landing-page",
    "/how-to-keep-your-profile-up-to-date",
    "/cv-resume-builder-alternatives",
    "/how-to-get-your-resume-past-applicant-tracking-systems",
    "/three-things-for-presenting-in-an-interview",
    "/red-flags-in-job-descriptions",
    "/how-to-explain-leaving-a-job-after-a-short-amount-of-time",
    "/how-to-download-your-resume-as-a-pdf",
    "/what-to-send-in-a-follow-up-email-after-an-interview",
    "/how-to-change-your-profile-url",
    "/how-to-add-links-to-your-profile",
    "/four-things-to-research-about-a-company-before-an-interview",
    "/how-to-ace-recorded-interviews",
    "/how-to-edit-the-information-on-your-profile",
    "/how-to-show-your-vitaely-website-on-a-custom-domain"
  ]; 
  const profiles = [
    "dlyhn7SmEOQHFhtFSJd88GpfkMo1",
    "c94rmatCXXXjdbQuWURljJTrlGh1",
    "i656J1OlMiN28IE5CbplxGTNmFQ2",
    "EdfOWDrC2vbuH5ZlQuAa4FCpvaR2",
    "JEDoZQK4oZRjEUuTINCSkypH0iR2",
    "lwcHfqxeeMSBptkaG98PQgIpooz1",
    "5f72eNx6DjQAv30F3u2pihdwwqA3",
    "5xFmCA898fTzUZWnaAqlcULwSQA3",
    "9s63eaCNirgB5NaK5oZFUOp51Zi1",
    "PWkqBKXBGtTRYNs0UHhxUHloBSu1",
    "dFgwLxKqygORNFcRBLogdijkUzE2",
    "ltyDXHbf1mhkBk81ylBgPfigRP03",
    "ZLQbEoUiNkP2UFWCUgcZYC2ythk2",
    "Iw6kj2hdQFgpk95XJgX81gDKGT92",
    "ReYf6cjVO9WqH2znbRlYyNHYKOl2",
    "2w0VevyPo5VgZLbkgZJCVo7Rl9O2",
    "F3yv4t8rcWTosKXkwYvRqfdqvvi1",
    "KbRnBv2H2ubzh0QvNljzh9wM9FI2",
    "FHNdkcMQNeOskKe28qwA657Ts653",
    "zYatLdnp8TgcwRJycaFruVpzBgH3",
    "PERqEPHF1aUIDSpqymXfaF0gB7e2",
    "0HuQ8tPWEmVxtfOAK0bkj1tYoo12",
    "a1QTtW4bhVhNsQcj041h0LbWCr12",
    "dFgwLxKqygORNFcRBLogdijkUzE2",
    "C1eoN9ozAAfx4In9uLxsbDM1TQk2",
    "3R0B0IKemWaYKaXy1Tc78AqhXqZ2",
    "9Sm5h4uwN1b5UbXjuRsSghgQN6r2",
    "pDDN5NjcwnhHLEBvpfBM16zjs202",
    "1jHV8KGdH3WlKpghpeslJLiC5O72",
    "qp29uHWxhUd5cqUHUN9hcamVfaj1",
    "F5Orpa81buU90XIiphN2ZxZzb583",
    "kzYypX5Rvghe1i3zDTtIQpqjQFl1",
    "03jHzcZ7GDdwtdjrRtchlCwwTwn2",
    "RVD4Y5HkOkcyDKWjc5kKJ6xzzTz1",
    "eQ5wuYJvzZf7QsD6VTU8UANsUum2",
    "dlyhn7SmEOQHFhtFSJd88GpfkMo1",
    "Ri05cJLRB8Ngjz6Tenlu8S1pC0h1",
    "3nnmiSGdjoPw14C7qFDSjdnVeVD3",
    "fUIhDV9xaadTOYqzqoqXiCid9c92",
    "jgKTRk9BxZQNrGBdv9Ckukzk7w22",
    "ObJPoDmtZmXvGa3MJTy01psQ0kX2",
    "gXrcF4nuDlY9Xst18tbl1nKVTPt1",
    "PstaXiXDauWE4WiAM0iqb0Ih3dV2",
    "z2Zes3MKixTISkOXlxtqrk4vfFV2",
    "7jCJiDud8Hf9jeCJis4r08O36ns2",
    "zMTXERNHjbUPS4YZ15HaUhA8lyk2",
    "tNg1MliphGZtZke3ni3Zd6hNqIG3",
    "7c6KwskqazSUwBSWIPJT6VdsjPz1",
    "YfZ5eFFgwNQtolM6D3dpCOKhmxp1",
    "SZDaY2Qv79awhtXLEyhEmlsfs4O2",
    "LR0PKxWdp4XJibB7koBVCFBD9jF3",
    "7rVgF0FlG3MD1G3n8HSReLGQFYD2",
    "RMhF9MIaYTTXoLWodnnhgwzVo2B3",
    "rx45vInCxoUJzyWe1h1IqMiYXSr2",
    "80RnUFsUWgbAhD13cBsMlWoITB53",
    "LU4k7SXhQWWIfQGEX0j1NcO96cz1",
    "vgv3znoWwyUVvWlB1WpohuDSEyA2",
    "C7AguVLI4XY4EmtT7jl38nZAIw82",
    "e7bCmRqVSfWeTI4FfJVPHytcQTm2",
    "P109zP9q8pbMwGulXzv4aAQZyhi1",
    "QWfQdvf1k9Na9DzjVAjNSfTmVtm1",
    "sSZFrFB4sxZNPQJTeAAU9FWDgxY2",
    "zJYQhBPGSKbmIU5ZM5iDEUpkSQQ2",
    "4AxyGPXGUwY2gAh4KRRkCrJdbaR2",
    "920uwMKep1YmcuUm7yOSMLXSB4o1",
    "Iw6kj2hdQFgpk95XJgX81gDKGT92",
    "DyagyCKRthZYpO57RqDxWppCYWw2",
    "Lm9MDgthXYTRwoRpvhp6FoNztNy1",
    "QB3qNgD8RPZIqReLZXtZglbtOby1",
    "jRtKniyg1dPGCtjoqY4Vo9icYWF2",
    "sSZFrFB4sxZNPQJTeAAU9FWDgxY2",
    "ZGrt2h5u5lQJ9FiHihk02sj8y2w2",
    "CPq14Ph3nJOLq1zZVxqISuEB9Nh1",
    "q4n9uzoFDjQnZlp8v4xcDqGa38G3",
    "o8LqUfhVEfP99ptrpnkTcyEr0kx2",
    "QB3qNgD8RPZIqReLZXtZglbtOby1",
    "u9d10NJ3f8PYuZB70vOaaywwnam1",
    "Lm9MDgthXYTRwoRpvhp6FoNztNy1",
    "ZJ9ODpHcBzUgtRCi2KEVVSmbxAE2",
    "kzYypX5Rvghe1i3zDTtIQpqjQFl1",
    "auARWSe6aOXC7FBFpt5j8FXJBfn1",
    "jFru3B7RjXb5YnnBXwp2jaka3XT2",
    "dK1XxftqhkcsFAdWkVnPGURbcUz1",
    "REOIQ46effS57Bk4SFBRJoaJVNt1",
    "xyI4ucad5zR05Kxo92I8yjbMHJz1",
    "ZGdbV1NkksTSGrsSCYTexYAZIpm2",
    "eg4g3EA0cQh1Mmk1OWjzpUotUz23",
    "d9KMJUSwzXPmjWa2uYEqwYcGPAo2",
    "OFCsPyWyKKWgayKLkFtJIiMVJhp1",
    "cwTNSqjwGTMSh9D5iPWkhUvCLOl2",
    "nVKEHBLKnlf9PKEDVvo6uypbGcT2",
    "ZGXv4GgEtcOOzGoPJJXw90JkGSK2",
    "acSH0z2nnje8tzaKiPVdJvjSZqi2",
    "9F0PJWo1BUaaSE5bJirxCUmZWGZ2",
    "XYBgNFFhSKUqRa0XGTebzdMIsuK2",
    "EwuNHWzXTHNG1TFrtliuWgAyt3w1",
  ]; 
  const premiumProfiles = [
    "aaronbutler",
    "rmenezes",
    "i.kunalsingh",
    "vahnovan",
    "rishav",
    "vama-trivedi"
  ]; 
  /*const profiles = fetch("/api/getProfilelist")*/
   //You can fetch the products from an API*/
  /*const profilesRes = await fetch("/api/getProfilelist")
  const profiles = await profilesRes.json()*/
  const sitemap = createSitemap(req.headers.host, routes, legals, users, blogs, profiles, premiumProfiles);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return res;
};

export default Sitemap;