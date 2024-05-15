import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let user: any;
  try {
    const { user }: any = await getSession();
    console.log('Middleware');
  } catch (error) {
    console.error(error);
  } finally {
    if (!user.email) {
      // redirect(`/`);
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    }
    console.log('finally block, going to back to home page');
  }

  return NextResponse.redirect(new URL('/', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
};
