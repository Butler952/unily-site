import fire from '../../config/fire-config';

export default (req, res) => {
  
  let redirectUrls = []

  fire.firestore().collection('redirects').get()
  .then((querySnapshot) => {
    querySnapshot.forEach((redirect) => {
      redirectUrls = [...redirectUrls, { 
        'source': redirect.source, 
        'destination': redirect.destination
      }];
    })
  })
  .then(() => {
    redirectUrls.forEach((redirect) => {
      if (req.url.includes(redirect.source)) {
        res.statusCode = 308
        res.setHeader('location', redirect.destination)
        // Caching headers
        res.set('Cache-control', 's-maxage=600')
        return res.end()
      }
    })
    // redirectUrls.map((redirect) => {
    //   if (req.url.startsWith(redirect.source)) {
    //     res.statusCode = 308
    //     res.setHeader('location', redirect.destination)
    //     // Caching headers
    //     res.set('Cache-control', 's-maxage=600')
    //     return res.end()
    //   }
    // })
    // Insert redirect rules here
  })
  .catch((error) => {
    console.log(error);
  });

  res.statusCode = 404
  return res.end('Not found')

}

// const redirectUrls = []

  //   fire.firestore()
  //   .collection('redirects')
  //   .get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((redirect) => {
  //       redirectUrls = [...redirectUrls, { 
  //         'source': redirect.source, 
  //         'destination': redirect.destination,
  //         'permanent': true
  //       }];
  //     })
  //   })

  //   return redirectUrls