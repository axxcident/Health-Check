import React from 'react';
import TeamFetch from './team-fetch';
import TeamMembersList from './team-members-list';
import UserNameFetch from './user-name-fetch';
import TeamOptions from './team-options';

type HeaderProps = {
  teamID?: string;
  userId?: string | null;
  CurrentPage?: string;
};

const WebHeader = async ({ teamID, userId, CurrentPage }: HeaderProps) => {
  return (
    <header className="h-[88px] w-full pl-8 pr-8 relative hidden laptop:flex justify-center laptop:justify-between items-center">
      <div className="flex items-center text-center">
        {CurrentPage === 'userPage' && userId ? (
          <h1 className="capitalize font-medium text-4xl laptop:font-semibold laptop:text-6xl text-[#393E46]">
            <UserNameFetch userID={userId} />
          </h1>
        ) : CurrentPage === 'teampage' && teamID ? (
          <>
            <h1 className="capitalize font-semibold text-1xl md:text-2xl lg:text-4xl xl:text-6xl text-[#393E46]">
              <TeamFetch teamID={teamID} />
            </h1>
            <TeamOptions user_id={userId as string} team_id={teamID} />
          </>
        ) : (
          <i>No Team nor User found</i>
        )}
      </div>
      {teamID && <TeamMembersList teamID={teamID} />}
      <div className="absolute left-8 right-8 top-[100%] h-1 laptop:shadow-black laptop:border-b-2 laptop:border-gray-200"></div>
    </header>
  );
};

export default WebHeader;
