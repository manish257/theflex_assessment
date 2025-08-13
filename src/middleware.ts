import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/dashboard')) {
    const header = req.headers.get('authorization') || req.cookies.get('auth')?.value || '';
    const expected = process.env.ADMIN_PASSWORD || '';
    const provided = header.startsWith('Basic ')
      ? (globalThis.atob ? globalThis.atob(header.slice(6)) : '')
      : '';
    // Format: username:password — allow any username, compare password only
    const password = provided.includes(':') ? provided.split(':').slice(1).join(':') : provided;
    if (!expected || password !== expected) {
      return new NextResponse('Unauthorized', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Dashboard"' } });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


