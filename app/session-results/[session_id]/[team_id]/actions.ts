'use server';

type SessionEntries = {
  entry_id: string;
  session_id: string;
  user_id: string;
  team_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

export async function FetchSessionResults(session_id: string) {
  let sessionData: SessionEntries[] = [];

  const getTeamData = async () => {
    try {
      if (session_id) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkin-entries?session_id=${session_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            next: { revalidate: 5 },
            // cache: 'no-store'
          },
        );

        if (response.ok) {
          const data = await response.json();
          sessionData = data.checkin_entries;
          // console.log('sessionData:', sessionData);
        } else {
          console.error(
            'Error with getTeamData-test function:',
            response.status,
          );
        }
      }
    } catch (error) {
      console.error('Error with getTeamData-test function');
    }
  };

  try {
    await getTeamData();
  } catch (error) {
    console.log('Error fetching session entries:', error);
  }

  return [sessionData];
}
