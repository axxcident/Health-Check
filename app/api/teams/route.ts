import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const teams = await sql`SELECT * FROM teams;`;
    return NextResponse.json({ teams: teams.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { team_id, team_name, user_id } = await request.json();

  try {
    if (
      !team_id ||
      typeof team_id !== 'string' ||
      team_id.trim() === '' ||
      !team_name ||
      typeof team_name !== 'string' ||
      team_name.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'Invalid team_id or team_name provided' },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO teams (team_id, team_name)
      VALUES (${team_id}, ${team_name})
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Team creation failed' },
        { status: 500 },
      );
    }

    await sql`INSERT INTO user_teams (user_id, team_id) VALUES (${user_id}, ${team_id});`;

    return NextResponse.json({ teams: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
