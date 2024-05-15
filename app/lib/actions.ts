'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';
import { getSession } from '@auth0/nextjs-auth0';
import { sql } from '@vercel/postgres';

export async function auth0Login() {
  let userID: string = '';
  let individual_user: any = {};
  revalidatePath(`${process.env.NEXT_PUBLIC_BASE_URL}/`);

  try {
    let emailsTotal = await sql`SELECT email FROM users`;

    const { user }: any = await getSession();

    if (emailsTotal.rows.length > 10) {
      return { message: 'Too many users in the database' };
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      user.email as string,
    );

    if (!isValidEmail) {
      return { message: 'Invalid email' };
    } else if (emailsTotal.rows.some(({ email }) => email === user.email)) {
      let picture: string = '';
      if (user.picture) {
        picture = user.picture;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              picture: picture,
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-Content-Type-Options': 'nosniff',
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          individual_user = data.individual_user;
          userID = data.individual_user.user_id;
          return { message: 'User Match' };
        } else {
          const errorData = await response.json();
          return { message: `${errorData.error}` };
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const email = user.email;
      const user_id = v4();
      let first_name = user.given_name;
      const last_name = user.family_name;
      if (!first_name && !last_name) {
        first_name = user.nickname;
      }
      let picture: string = '';
      if (user.picture) {
        picture = user.picture;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: user_id,
              first_name: first_name,
              email: email,
              lastName: last_name || '',
              picture: picture,
            }),
          },
        );
        if (response.ok) {
          // console.log('response.ok', response.ok);
          const data = await response.json();
          // console.log('data:', data);
          individual_user = data;
          return data;
        } else {
          console.error('Error creating user:', response.status);
          return { message: 'Error creating user' };
        }
      } catch (error) {
        console.error('Error creating user:', error);
        return { message: 'Error creating user' };
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (userID) {
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${userID}`);
    } else if (individual_user.user) {
      // console.log('new_user:', individual_user.user);
      redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${individual_user.user.user_id}`,
      );
    } else {
      console.log('Final else block. user was not logged in nor created');
    }
  }
}

export async function logInUser(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const email = formData.get('email');
  const password = formData.get('password');

  const isValidEmail = /^[a-zA-Z0-9._-]+@bontouch\.com$/.test(email as string);
  if (!isValidEmail) {
    return { message: 'Invalid email' };
  }

  let userID: string = '';

  try {
    prevState = { message: 'Pending True' };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      cookies().set('user', JSON.stringify(data.individual_user), {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        maxAge: 360000,
        priority: 'high',
      });
      prevState = { message: 'Pending False' };
      userID = data.individual_user.user_id;
      return { message: 'Pending False' };
    } else {
      const errorData = await response.json();
      return { message: `${errorData.error}` };
    }
  } catch (e) {
    prevState = { message: 'Password and email did not match' };
    return { message: 'Failed to get FormData' };
  } finally {
    if (prevState.message === 'Pending False') {
      redirect(`/user-dashboard/${userID}`);
    }
  }
}

export async function joinTeamAction(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const user_id = formData.get('user_id');
  const team_id = formData.get('team_id');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/team`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          team_id: team_id,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'User added to team' };
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      );
      return { message: 'User added to team' };
    } else {
      console.error('Error joining team:', response.status);
      return { message: 'Error joining team' };
    }
  } catch (error) {
    console.error('Error joining team:', error);
    return { message: 'Error joining team' };
  }
}

export async function logOutUser(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const user_id = formData.get('user_id');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/logout?user_id=${user_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'User is logging out' };
    } else {
      console.error('ELSE: Error logging out: ', response.status);
      return { message: 'ELSE: Error logging out' };
    }
  } catch (error) {
    console.error('CATCH: Error logging out:', error);
    return { message: 'CATCH: Error logging out:' };
  } finally {
    if (prevState.message === 'User is logging out') {
      cookies().delete('user');
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
    }
    return { message: 'finally block' };
  }
}

export async function createNewSession(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const team_id = formData.get('team_id');
  const session_id = v4();
  const now = new Date();

  let sessionEntriesTotal = await sql`SELECT session_id FROM checkin_sessions`;
  if (sessionEntriesTotal.rows.length >= 200) {
    return { message: 'Sessions is full' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkin-sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session_id,
          team_id: team_id,
          session_date: now.toISOString(),
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'New session created' };
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/team-dashboard/${team_id}`,
      );
      return { message: 'New session created' };
    } else {
      console.error('ELSE BLOCK: Error creating session:', response.status);
      return { message: 'ELSE BLOCK: Error creating session' };
    }
  } catch (error) {
    console.error('CATCH BLOCK: Error creating session:', error);
    return { message: 'CATCH BLOCK: Error creating session' };
  }
}

export async function createNewTeam(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const team_name = formData.get('team_name');
  const user_id = formData.get('user_id');
  const team_id = v4();

  let teamsTotal = await sql`SELECT team_id FROM teams`;
  if (teamsTotal.rows.length >= 12) {
    return { message: 'too many teams' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team_id,
          team_name: team_name,
          user_id: user_id,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'New team created' };
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      );
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/team-dashboard/${team_id}`,
      );
      return { message: 'New team created' };
    } else {
      console.error('ELSE BLOCK: Error creating team:', response.status);
      return { message: 'ELSE BLOCK: Error creating team' };
    }
  } catch (error) {
    console.error('CATCH BLOCK: Error creating team:', error);
    return { message: 'CATCH BLOCK: Error creating team' };
  }
}

export async function leaveTeam(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const user_id = formData.get('user_id');
  const team_id = formData.get('team_id');

  try {
    prevState = { message: 'User leaving team' };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/team`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team_id,
          user_id: user_id,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'User left team' };
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      );
      prevState = { message: 'User left team' };
      return { message: 'User left team' };
    } else {
      console.error('ELSE BLOCK: Error leaving team:', response.status);
      return { message: 'ELSE BLOCK: Error leaving team' };
    }
  } catch (error) {
    console.error('CATCH BLOCK: Error leaving team:', error);
    return { message: 'CATCH BLOCK: Error leaving team' };
  } finally {
    if (prevState.message === 'User left team') {
      // redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`);
      redirect(`/user-dashboard/${user_id}`);
    }
  }
}

export async function userTeams(user_id: string) {
  let teams: any = {};
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-teams`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          team_id: '',
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      teams = data.members;
      return teams;
    } else {
      console.error('Error fetching user teams:', response.status);
      return { message: 'Error fetching user teams' };
    }
  } catch (error) {
    console.error('Error fetching user teams:', error);
    return { message: 'Error fetching user teams' };
  } finally {
    // console.log('Finally block in lib/actions.ts - userTeams function');
    // console.log('teams:', teams);
    revalidatePath(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
    );
  }
}
