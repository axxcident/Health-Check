import { sql } from '@vercel/postgres';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(request: Request, response: NextApiResponse) {
  const { searchParams } = new URL(request.url);
  const Session_id = searchParams.get('Session_id');
  const userId = searchParams.get('User_id');

  try {
    let sessionEntries;
    if (Session_id && !userId) {
      sessionEntries = await sql`
        SELECT * FROM checkin_entries
        WHERE Session_id = ${Session_id};
      `;
    } else if (Session_id && userId) {
      sessionEntries = await sql`
        SELECT * FROM checkin_entries
        WHERE Session_id = ${Session_id} AND User_id = ${userId};
      `;
    } else {
      throw new Error('Invalid parameters');
    }

    return NextResponse.json(
      { session_entries: sessionEntries.rows },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
