import React from 'react';
import UserIcon from './user-icon';
import HeaderModalSessionHandler from './header-modal-session-handler';

type TeamListProp = {
  teamID: string;
};

type teamData = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string;
  password: string;
  lastname: string;
  picture: string;
};

const TeamMembersList = async ({ teamID }: TeamListProp) => {
  let members: teamData[] | null = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-teams`,
      {
        method: 'POST',
        body: JSON.stringify({
          team_id: teamID,
          user_id: '',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      members = data.members;
    } else {
      const errorData = await response.json();
    }
  } catch (e) {
    console.log('Failed to get FormData');
  }

  return (
    <div className="flex items-center">
      <HeaderModalSessionHandler
        BtnClassName="w-[100%] font-semibold min-w-[150px] min-h-[60px] max-w-[160px]"
        team_id={teamID}
      />
      <div
        className="flex max-w-52 min-w-20 ml-2 mr-4 overflow-x-auto"
        style={{
          scrollbarWidth: 'auto',
          scrollbarColor: 'gray',
          msScrollbarTrackColor: '#f1f1f1',
        }}
      >
        {members &&
          members.map((team: teamData) => (
            <UserIcon
              key={team.user_id}
              firstName={team.first_name}
              lastName={team.lastname}
              userID={team.user_id}
              picture={team.picture}
            />
          ))}
      </div>
    </div>
  );
};

export default TeamMembersList;
