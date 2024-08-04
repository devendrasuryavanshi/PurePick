import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    const currentUrl = request.nextUrl.pathname;

    // If the user is authenticated and tries to access login or signup, redirect them to the home page
    if (token && (currentUrl === '/login' || currentUrl === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/signup',
        '/login',
    ],
};
