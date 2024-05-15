import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const checkin_entries = await sql`SELECT * FROM checkin_sessions;`;
    return NextResponse.json(
      { checkin_sessions: checkin_entries.rows },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session_id, team_id, session_date } = await request.json();

  try {
    const result = await sql`
      INSERT INTO checkin_sessions (Session_id, Team_id, Session_date)
      VALUES (${session_id}, ${team_id}, ${session_date})
      RETURNING *;
    `;

    return NextResponse.json(
      { checkin_sessions: result.rows[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
