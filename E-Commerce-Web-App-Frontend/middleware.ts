import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_CUSTOMER = ['/cart', '/checkout'];
const PROTECTED_ADMIN = ['/admin'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We store token in localStorage (client-only), so the middleware relies on
    // a cookie set by the client side when logging in. If not present, redirect.
    const token = request.cookies.get('token')?.value;

    const isAdminRoute = PROTECTED_ADMIN.some((p) => pathname.startsWith(p));
    const isCustomerRoute = PROTECTED_CUSTOMER.some((p) => pathname.startsWith(p));

    if ((isAdminRoute || isCustomerRoute) && !token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/cart/:path*', '/checkout/:path*', '/admin/:path*'],
};
