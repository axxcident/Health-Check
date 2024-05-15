import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {
    entry_id,
    session_id,
    user_id,
    team_id,
    happiness,
    productivity,
    stress,
    comment,
  } = await request.json();

  try {
    const result = await sql`
      INSERT INTO checkin_entries (entry_id, session_id, user_id, team_id, happiness, productivity, stress, comment)
      VALUES (${entry_id}, ${session_id}, ${user_id}, ${team_id}, ${happiness}, ${productivity}, ${stress}, ${comment})
      RETURNING *;
    `;

    return NextResponse.json({ entry: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const team_id = searchParams.get('team_id');
  const session_id = searchParams.get('session_id');

  if (team_id) {
    try {
      const checkin_entries = await sql`
      SELECT cs.session_id, cs.team_id, cs.session_date,
      ce.entry_id, ce.user_id, ce.happiness, ce.productivity, ce.stress, ce.comment
      FROM checkin_sessions cs
      INNER JOIN checkin_entries ce ON cs.session_id = ce.session_id
      WHERE ce.team_id = ${team_id};
    `;
      return NextResponse.json(
        { checkin_entries: checkin_entries.rows },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } else if (session_id) {
    try {
      const checkin_entries =
        await sql`SELECT * FROM checkin_entries WHERE Session_id = ${session_id};`;
      return NextResponse.json(
        { checkin_entries: checkin_entries.rows },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  } else {
    const checkin_entries = await sql`SELECT * FROM checkin_entries;`;
    return NextResponse.json(
      { checkin_entries: checkin_entries.rows },
      { status: 200 },
    );
  }
}
