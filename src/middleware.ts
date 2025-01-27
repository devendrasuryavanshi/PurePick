import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Check both possible cookie names that NextAuth uses
    const authToken = request.cookies.get("next-auth.session-token") || 
                     request.cookies.get("__Secure-next-auth.session-token");
    
    const path = request.nextUrl.pathname;

    // For profile routes - must be logged in
    if (path.startsWith('/profile') || path.startsWith('/feedback') || path.startsWith('/product-history')) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // For auth routes - must be logged out
    if (path === '/login' || path === '/signup') {
        if (authToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/signup',
        '/login',
        '/product-history',
        '/feedback',
    ]
};






// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export async function middleware(request: NextRequest) {
//     const token = await getToken({ req: request });

//     const currentUrl = request.nextUrl.pathname;

//     if (!token && (currentUrl.startsWith('/profile') || currentUrl.startsWith('/feedback') || currentUrl.startsWith('/product-history'))) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (token && (currentUrl === '/login' || currentUrl === '/signup')) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/profile/:path*',
//         '/signup',
//         '/login',
//         '/product-history',
//         '/feedback',
//     ],
// };
