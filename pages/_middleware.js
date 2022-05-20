import { NextRequest, NextResponse } from 'next/server'
import { getBucket } from '../lib/ab-testing'
import { LANDING_BUCKETS } from '../lib/buckets'

const COOKIE_NAME = 'bucket-landing';

export function middleware(req) {
  // Get the bucket cookie

  const bucket = req.cookies[COOKIE_NAME] || getBucket(LANDING_BUCKETS)
  if (req.nextUrl.pathname == "/") {
    const url = req.nextUrl.clone()
    url.pathname = `/${bucket}`
    const res = NextResponse.rewrite(url)

    if (!req.cookies[COOKIE_NAME]) {
        res.cookie(COOKIE_NAME, bucket)
      }
    
      return res
  } else {
    const url = req.nextUrl.clone()
    const res = NextResponse.rewrite(url)

    if (!req.cookies[COOKIE_NAME]) {
        res.cookie(COOKIE_NAME, bucket)
      }
    
      return res
  }

//   const url = req.nextUrl.clone()
//   url.pathname = `/${bucket}`
//   const res = NextResponse.rewrite(url)

  // Add the bucket to cookies if it's not there
}