import { useState, useEffect } from 'react';
import fire from '../config/fire-config';

module.exports = {
  /*env: {
    STRIPE_PRODUCT_PREMIUM: 'prod_Jdg7o4VDoipc7d',
  },*/
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    // if (!isServer) {
    //   config.node = {
    //     fs: 'empty'
    //   }
    // }

    return config
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },

  //   /*const profiles = fetch("/api/getProfilelist")*/
  async redirects() {

    const redirectUrls = []

    fire.firestore()
    .collection('redirects')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((redirect) => {
        redirectUrls = [...redirectUrls, { 
          'source': redirect.source, 
          'destination': redirect.destination,
          'permanent': true
        }];
      })
    })

    return redirectUrls
    // return [
    //   {
    //     source: '/',
    //     destination: '/welcome',
    //     permanent: true,
    //   },
    // ]
  },
};