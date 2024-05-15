import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const Team_id = searchParams.get('Team_id');

  try {
    const team = await sql`SELECT * FROM teams WHERE Team_id = ${Team_id};`;
    return NextResponse.json({ team: team.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  const { user_id, team_id } = await request.json();

  if (
    !user_id ||
    !team_id ||
    typeof user_id !== 'string' ||
    typeof team_id !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Invalid user_id or team_id' },
      { status: 400 },
    );
  }
  const validUUIDFormat =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!validUUIDFormat.test(user_id)) {
    return NextResponse.json(
      { error: 'Invalid user_id format' },
      { status: 400 },
    );
  } else if (!validUUIDFormat.test(team_id)) {
    return NextResponse.json(
      { error: 'Invalid team_id format' },
      { status: 400 },
    );
  }

  try {
    const userExists =
      await sql`SELECT 1 FROM users WHERE user_id = ${user_id};`;
    console.log('userExists.rows.length: ' + userExists.rows.length);
    if (userExists.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const teamExists =
      await sql`SELECT 1 FROM teams WHERE team_id = ${team_id};`;
    console.log('teamExists.rows.length: ' + teamExists.rows.length);
    if (teamExists.rows.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    await sql`INSERT INTO user_teams (user_id, team_id) VALUES (${user_id}, ${team_id});`;

    return NextResponse.json(
      { message: 'User added to team' },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'User is already on this team' },
        { status: 400 },
      );
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, response: NextResponse) {
  const { user_id, team_id } = await request.json();

  if (
    !user_id ||
    !team_id ||
    typeof user_id !== 'string' ||
    typeof team_id !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Invalid user_id or team_id' },
      { status: 400 },
    );
  }
  const validUUIDFormat =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!validUUIDFormat.test(user_id)) {
    return NextResponse.json(
      { error: 'Invalid user_id format' },
      { status: 400 },
    );
  } else if (!validUUIDFormat.test(team_id)) {
    return NextResponse.json(
      { error: 'Invalid team_id format' },
      { status: 400 },
    );
  }

  try {
    const userExists =
      await sql`SELECT 1 FROM users WHERE user_id = ${user_id};`;
    if (userExists.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const teamExists =
      await sql`SELECT 1 FROM teams WHERE team_id = ${team_id};`;
    if (teamExists.rows.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    await sql`DELETE FROM user_teams WHERE user_id = ${user_id} AND team_id = ${team_id};`;

    return NextResponse.json({ message: 'User left team' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
