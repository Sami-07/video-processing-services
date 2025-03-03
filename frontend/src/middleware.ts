import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)', 
  // Protect all API routes except webhooks
   '/api/(.(?!webhooks/clerk))*'
]);
const isPublicRoute = createRouteMatcher(['/', '/sign-in', '/sign-up', '/api/webhooks/clerk']);
export default clerkMiddleware(async (auth, req) => {
    console.log('Middleware executed', req.url);
    const { userId } = await auth();
    console.log("userId", userId);
    if (isPublicRoute(req) && userId) {
        console.log('Public route, but user ID found', req.url);
        return NextResponse.redirect(new URL('/dashboard/all-videos', req.url));
    }
    if (isProtectedRoute(req) && !userId) {
        console.log('Protected route, but no user ID found', req.url);
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Dashboard
    '/dashboard(.*)',
    // Profile
    '/profile(.*)',
  '/dashboard/(.*)',
  ],
};