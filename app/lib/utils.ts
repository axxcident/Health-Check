import { getSession } from '@auth0/nextjs-auth0';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function generateColorsFromInitials(
  firstName: string,
  lastName: string,
) {
  const firstInitial = firstName.charCodeAt(0);
  const lastInitial = lastName.charCodeAt(0);

  // Use the ASCII values to generate hue values (0-360)
  const hue1 = ((firstInitial * 137) % 360).toFixed(2);
  const hue2 = ((lastInitial * 137) % 360).toFixed(2);

  // Convert hue values to CSS color format (HSL)
  const color1 = `hsl(${hue1}, 70%, 50%)`;
  const color2 = `hsl(${hue2}, 70%, 50%)`;

  return { start: color1, end: color2 };
}

export async function getUserCookies() {
  let userID: string | null = null;

  const userCookie = cookies().get('user');

  if (userCookie) {
    const userData = JSON.parse(userCookie.value);

    try {
      let datan =
        await sql`SELECT * FROM users WHERE user_id = ${userData?.user_id};`;
      const { rows: userRows } = datan;
      userID = userRows[0].user_id as string;
    } catch (error) {
      console.error('Error getting user data in lib/utils.ts : ', error);
    }
  } else {
    console.error('User cookie not found or has no value');
    return { userID: null };
  }

  return { userID };
}

export async function getUserTeams(user_id: string) {
  let user_teams: any[] = [];
  if (user_id) {
    try {
      let data =
        await sql`SELECT * FROM user_teams WHERE user_id = ${user_id};`;
      const { rows } = data;
      // console.log('rows: ', rows);
      user_teams = rows;
    } catch (error) {
      console.error('Error getting team data in lib/utils.ts: ', error);
    }
  } else {
    console.error('No user_id provided to getUserTeams');
  }

  return { user_teams };
}

export async function getUserIdByEmail() {
  let user_id: string | any;
  const { user }: any = await getSession();
  if (user.email) {
    try {
      const userId =
        await sql`SELECT User_id FROM users WHERE email = ${user.email};`;
      user_id = userId.rows[0].user_id;
    } catch (error) {
      console.error(error);
    }
  }
  return { user_id };
}
