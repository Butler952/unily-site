import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // "/",
    "/:path",
    // "/site/:id",
    // "/site/:id/:path",
    // "/post/:id",
    // "/post/:id/:path",
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "expertpage.io";

  // // Only for demo purposes – remove this if you want to use your root domain as the landing page
  // if (hostname === "expertpage.io") {
  //   return NextResponse.redirect("https://expertpage.io");
  // }

  const currentHost =
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "development"
      ? hostname.replace(`.expertpage.io`, "")
      : hostname.replace(`.localhost:3000`, "")

  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {

  
    if (
      hostname === "localhost:3000" ||
      hostname === "expertpage.io"
    ) {
      url.pathname = `/${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${currentHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}