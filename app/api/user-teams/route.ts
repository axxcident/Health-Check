import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  const { team_id, user_id } = await request.json();

  if (!team_id && !user_id) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  if (team_id !== '' && user_id === '') {
    // Select all users for a team
    try {
      const result = await sql`SELECT users.*
        FROM user_teams
        JOIN users ON user_teams.user_id = users.user_id
        WHERE user_teams.team_id = ${team_id};`;

      return NextResponse.json({ members: result.rows }, { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error }, { status: 500 });
    } finally {
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/team-dashboard/${team_id}`,
      );
    }
  } else if (user_id !== '' && team_id === '') {
    // Select all teams for a user
    try {
      const result = await sql`SELECT teams.*
      FROM user_teams
      JOIN teams ON user_teams.team_id = teams.team_id
      WHERE user_teams.user_id  = ${user_id};`;

      return NextResponse.json({ members: result.rows }, { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error }, { status: 500 });
    } finally {
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      );
    }
  } else {
    return NextResponse.json({ error: 'Not allowed' }, { status: 400 });
  }
}
