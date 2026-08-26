import { clerkMiddleware, createRouteMatcher, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/admin/login(.*)',
  '/admin/pending-approval(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/contact(.*)',
  '/api/health(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth.protect();

    if (userId) {
      const user = await currentUser();
      let role = user?.publicMetadata?.role as string | undefined;
      let approved = user?.publicMetadata?.approved as boolean | undefined;

      // Auto-promote the first registered user to Super Admin & Approved
      if (!role || approved === undefined) {
        const client = await clerkClient();
        const { totalCount } = await client.users.getUserList();

        if (totalCount <= 1) {
          role = 'SUPER_ADMIN';
          approved = true;
        } else {
          role = 'ADMIN';
          approved = false;
        }

        await client.users.updateUserMetadata(userId, {
          publicMetadata: { role, approved },
        });
      }

      // If user is not approved yet and trying to access protected admin pages/APIs
      if (!approved && !req.nextUrl.pathname.startsWith('/admin/pending-approval')) {
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json(
            { success: false, message: 'Account is pending approval by Super Admin' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/admin/pending-approval', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
