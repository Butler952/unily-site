import Head from "next/head";

const Home = () => {

  return (
    <div>
      <Head>
        <title>Aaron wants to join Founders Factory</title>
        <meta
          name="description"
          content="Aaron wants to join Founders Factory"
        />
        <meta
          property="og:title"
          content="Aaron wants to join Founders Factory"
        />
        <meta
          property="og:description"
          content="Aaron wants to join Founders Factory"
        />
        <meta property="og:url" content="https://www.epicbabynames.com/" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="https://api.apiflash.com/v1/urltoimage?access_key=c0862ed5113840318341823ac08fe465&wait_until=page_loaded&url=https%3A%2F%2Fwww.vitaely.me" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        />
        <meta
          property="og:image"
          content="https://www.epicbabynames.com/images/twitter-summary-large-image.jpeg"
        />
      </Head>
      <div style={{maxWidth: '720px', margin: '160px auto'}}>
        <h1>Aaron wants to join Founders Factory</h1>
      </div>
    </div>
  );
};

export default Home;
