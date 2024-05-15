import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request, response: NextResponse) {
  const { user_id, team_id } = await request.json();

  try {
    const yourCheckIns = await sql`SELECT
    cs.session_id,
    cs.team_id,
    cs.session_date,
    ce.entry_id,
    ce.happiness,
    ce.productivity,
    ce.stress,
    ce.comment
  FROM
    checkin_sessions cs
  LEFT JOIN
    checkin_entries ce ON cs.session_id = ce.session_id
  WHERE
    cs.team_id = ${team_id} AND ce.user_id = ${user_id} ;`;

    if (yourCheckIns.rows.length === 0) {
      return NextResponse.json(
        { error: 'No check-ins found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { your_check_ins: yourCheckIns.rows },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
