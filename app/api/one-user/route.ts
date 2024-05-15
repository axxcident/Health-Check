import { sql } from '@vercel/postgres';
import { NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, response: NextApiResponse) {
  const { searchParams } = new URL(request.url);

  // Check if it's a GET request with User_id in query params
  const userId = searchParams.get('User_id');
  if (request.method === 'GET' && userId) {
    try {
      const individual_user =
        await sql`SELECT * FROM users WHERE user_id = ${userId};`;
      return NextResponse.json(
        { individual_user: individual_user.rows[0] },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'Route not found' }, { status: 404 });
}

export async function POST(request: NextRequest, response: NextResponse) {
  const { email, picture } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  console.log('We are in, one-user, the api POST route');

  if (request.method === 'POST') {
    try {
      const individual_user = await sql`
        SELECT * FROM users WHERE email = ${email};
      `;

      if (individual_user.rows.length > 0) {
        // console.log('individual_user.rows[0]: ', individual_user.rows[0]);
        // console.log('updating user profile picture: ', picture);

        // Wrapping the update operation inside another try/catch block
        try {
          const updated_user = await sql`
            UPDATE users
            SET picture = ${picture}
            WHERE email = ${email}
            RETURNING *;
          `;

          // console.log('updated_user: ', updated_user);

          return NextResponse.json(
            { individual_user: individual_user.rows[0] },
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
      } else {
        return NextResponse.json(
          { error: 'email did not match' },
          { status: 404 },
        );
      }
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

// export async function POST(request: NextRequest, response: NextResponse) {
//   const { email } = await request.json();

//   if (!email) {
//     return NextResponse.json({ error: 'Missing email' }, { status: 400 });
//   }

//   console.log('We are in the POST route');

//   if (request.method === 'POST') {
//     try {
//       const individual_user = await sql`
//         SELECT * FROM users WHERE email = ${email};
//       `;
//       if (individual_user.rows.length > 0) {
//         // console.log('individual_user.rows[0]: ', individual_user.rows[0]);

//         // console.log('updating userprofile picture: ', picture);
//         // const updated_user = await sql`
//         //   UPDATE users
//         //   SET picture = ${picture}
//         //   WHERE email = ${email}
//         //   RETURNING *;
//         // `;
//         // console.log('updated_user: ', updated_user);

//         return NextResponse.json(
//           { individual_user: individual_user.rows[0] },
//           {
//             status: 200,
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Content-Type-Options': 'nosniff',
//             },
//           },
//         );
//       } else {
//         return NextResponse.json(
//           { error: 'email did not match' },
//           { status: 404 },
//         );
//       }
//     } catch (error) {
//       return NextResponse.json({ error }, { status: 500 });
//     }
//   }
//   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
// }

// export async function POST(request: NextRequest, response: NextResponse) {
//   const { email, picture } = await request.json();

//   if (!email) {
//     return NextResponse.json({ error: 'Missing email' }, { status: 400 });
//   }

//   console.log('We are in the POST route');

//   if (request.method === 'POST') {
//     try {
//       const individual_user = await sql`
//         SELECT * FROM users WHERE email = ${email};
//       `;
//       if (individual_user.rows.length > 0) {
//         console.log('individual_user.rows[0]: ', individual_user.rows[0]);

//         console.log('updating userprofile picture: ', picture);
//         const updated_user = await sql`
//           UPDATE users
//           SET picture = ${picture}
//           WHERE email = ${email}
//           RETURNING *;
//         `;
//         console.log('updated_user: ', updated_user);

//         return NextResponse.json(
//           { individual_user: individual_user.rows[0] },
//           {
//             status: 200,
//             headers: {
//               'Content-Type': 'application/json',
//               'X-Content-Type-Options': 'nosniff',
//             },
//           },
//         );
//       } else {
//         return NextResponse.json(
//           { error: 'email did not match' },
//           { status: 404 },
//         );
//       }
//     } catch (error) {
//       return NextResponse.json({ error }, { status: 500 });
//     }
//   }
//   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
// }
