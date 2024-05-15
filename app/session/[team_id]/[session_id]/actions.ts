'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

export async function addSessionData(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const happiness = formData.get('happiness');
  const productivity = formData.get('productivity');
  const stress = formData.get('stress');
  const comment = formData.get('comment');
  const userID = formData.get('user_id');
  const teamID = formData.get('team_id');
  const sessionID = formData.get('session_id');

  let sessionEntriesTotal = await sql`SELECT entry_id FROM checkin_entries`;

  if (sessionEntriesTotal.rows.length >= 200) {
    return { message: 'Sessions is full' };
  }

  try {
    const entry_id = v4();
    await sql`
      INSERT INTO checkin_entries (entry_id, session_id, user_id, team_id, happiness, productivity, stress, comment)
      VALUES (${entry_id}, ${sessionID as string}, ${userID as string}, ${teamID as string}, ${happiness as string}, ${productivity as string}, ${stress as string}, ${comment as string})
      RETURNING *;
    `;

    return { message: `reload` };
  } catch (e) {
    return { message: 'Failed to get FormData' };
  } finally {
    revalidatePath(
      `/session-results/${sessionID as string}/${teamID as string}`,
      'page',
    );
    redirect(`/session-results/${sessionID as string}/${teamID as string}`);
  }
}
