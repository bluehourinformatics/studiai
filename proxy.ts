import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/vapi/searchbook",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isLandingPage = req.nextUrl.pathname === "/";

  if (userId && isLandingPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/((?!api/vapi/searchbook|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
