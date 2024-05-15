import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { team_id } = await request.json();

  try {
    const chosen_team = await sql`
      SELECT * FROM teams WHERE Team_id = ${team_id};
    `;
    if (chosen_team.rows.length > 0) {
      return NextResponse.json(
        { chosen_team: chosen_team.rows[0] },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        },
      );
    } else {
      return NextResponse.json({ error: 'No Team_id match' }, { status: 404 });
    }
  } catch (error: any) {
    if (error.code === '22P02') {
      return NextResponse.json({ error: 'No Team_id match' }, { status: 404 });
    } else {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
