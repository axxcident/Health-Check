'use server';

// import { revalidatePath } from 'next/cache';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

export async function allTeamMembers(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const team_id = formData.get('team_id');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-teams`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: team_id,
          user_id: '',
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'chose new team' };
      return data.members;
      // revalidatePath(
      //   `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`,
      // );
      // return { message: 'chose new team' };
    } else {
      console.error('ELSE: Error fetching team members:', response.status);
      return { message: 'ELSE: Error fetching team members' };
    }
  } catch (error) {
    console.error('CATCH: Error fetching team members:', error);
    return { message: 'CATCH: Error fetching team members' };
  }
}
