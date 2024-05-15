import { sql } from '@vercel/postgres';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(request: Request, response: NextApiResponse) {
  const { searchParams } = new URL(request.url);
  const teamID = searchParams.get('team_id');

  try {
    const sessions = await sql`SELECT
    cs.session_id,
    cs.team_id,
    cs.session_date,
    ce.entry_id,
    ce.happiness,
    ce.productivity,
    ce.stress,
    ce.comment,
    ce.user_id
  FROM
    checkin_sessions cs
  LEFT JOIN
    checkin_entries ce ON cs.session_id = ce.session_id
  WHERE
    cs.team_id = ${teamID};`;

    return NextResponse.json({ sessions: sessions.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
