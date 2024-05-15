'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

export async function chooseTeam(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const user_id = formData.get('user_id');
  const team_id = formData.get('team_id');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/team-pick`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team_id,
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'chose new team' };
      revalidatePath(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      );
      return data.chosen_team.team_id;
      // return { message: 'chose new team' };
    } else {
      console.error('ELSE: Error choosing team:', response.status);
      return { message: 'ELSE: Error choosing team' };
    }
  } catch (error) {
    console.error('CATCH: Error choosing team:', error);
    return { message: 'CATCH: Error choosing team' };
  }
}
