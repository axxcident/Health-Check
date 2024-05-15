import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get('user_id');

  try {
    const individual_user = await sql`
      SELECT * FROM users WHERE User_id = ${user_id};
    `;
    if (individual_user.rows.length > 0) {
      return NextResponse.json(
        { individual_user: individual_user.rows[0] },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    } else {
      return NextResponse.json({ error: 'No User_id match' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
