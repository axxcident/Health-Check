import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// GET request for fetching all users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const team_id = searchParams.get('team_id');

  const sokparams = request.nextUrl.searchParams;
  const lag_id = sokparams.get('team_id');
  console.log('lag_id: ', lag_id);

  try {
    if (team_id) {
      const team_members = await sql`
        SELECT t.team_name, u.user_id, u.first_name, u.lastName, u.email
        FROM teams t
        INNER JOIN users u ON t.team_id = u.team_id
        WHERE u.team_id = ${lag_id};
      `;
      return NextResponse.json(
        { team_members: team_members.rows },
        { status: 200 },
      );
    } else {
      const users = await sql`SELECT * FROM users;`;
      return NextResponse.json({ users: users.rows }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user_id, first_name, email, lastName, picture } =
    await request.json();

  try {
    const result = await sql`
      INSERT INTO users (User_id, First_name, Email, Lastname, picture)
      VALUES (${user_id}, ${first_name}, ${email}, ${lastName} , ${picture})
      RETURNING *;
    `;
    // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`, { status: 307 });
    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
