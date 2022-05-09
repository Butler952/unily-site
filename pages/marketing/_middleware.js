import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '../../lib/ab-testing'
import { MARKETING_BUCKETS } from '../../lib/buckets'

const COOKIE_NAME = 'bucket-marketing';

export function middleware(req) {
  // Get the bucket cookie
  const bucket = req.cookies[COOKIE_NAME] || getBucket(MARKETING_BUCKETS)
  const url = req.nextUrl.clone()
  url.pathname = `/marketing/${bucket}`
  const res = NextResponse.rewrite(url)

  // Add the bucket to cookies if it's not there
  if (!req.cookies[COOKIE_NAME]) {
    res.cookie(COOKIE_NAME, bucket)
  }

  return res
}


/* 

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export default function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

*/