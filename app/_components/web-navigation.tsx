import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserOptions from './user-options';
import UserIcon from './user-icon';
import TeamFetch from './team-fetch';
import ModalBtnHandler from './modal-btn-handler';
import { userTeams } from '../lib/actions';
import MobileNav from './mobile-nav';
import UserNameFetch from './user-name-fetch';

type User = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string | null;
  password: string | null;
  lastname: string;
  picture: string;
};

type CurrentPageProp = {
  CurrentPage?: string;
  Currentteam?: string;
  user_id?: string;
};

const WebNavigation = async ({
  CurrentPage,
  Currentteam,
  user_id,
}: CurrentPageProp) => {
  let user: User | null = null;
  let userteams = await userTeams(user_id as string);

  if (user_id) {
    try {
      const datan: any = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user?User_id=${user_id}`,
      );
      const userDatan = await datan.json();
      user = userDatan.individual_user;
    } catch (error) {
      console.error('Error fetching user in WebNavigation: ', error);
    }
    // finally {
    //   console.log('userPicture:', user);
    // }
  }

  return (
    <nav className="fixed hidden laptop:block laptop:h-full laptop:w-[225px] bg-white laptop:bg-transparent shadow-md laptop:border-r-2 border-gray-100 z-10">
      <aside className="hidden laptop:flex flex-col justify-between h-full">
        <div>
          <div className="laptop:block hidden overflow-hidden w-[223px] h-[129px]">
            <Image
              src="/health-check-in.png"
              alt="health check in logo"
              width={1024}
              height={1024}
              className="object-cover w-full h-full transform scale-[1.75]"
              priority={true}
            />
          </div>
          <div className="laptop:block hidden text-black">
            <h3 className="uppercase font-bold text-[12px] p-3 mt-1 ml-1 text-[#4C5769]">
              personal
            </h3>
            {user?.user_id ? (
              <Link
                className={`flex ml-3 mr-3 w-auto h-10 p-3 rounded-md capitalize items-center ${CurrentPage === 'userPage' ? 'bg-[#EE8DB6]' : ''}`}
                href={`/user-dashboard/${user?.user_id}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.66667 2H2V6.66667H6.66667V2Z"
                    fill={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    stroke={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2H9.33337V6.66667H14V2Z"
                    fill={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    stroke={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 9.33325H9.33337V13.9999H14V9.33325Z"
                    fill={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    stroke={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66667 9.33325H2V13.9999H6.66667V9.33325Z"
                    fill={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    stroke={`${CurrentPage === 'userPage' ? 'white' : '#687792'}`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={`font-medium text-sm text-[#687792] pl-1 ${CurrentPage === 'userPage' ? 'text-white' : 'text-[#687792]'}`}
                >
                  Your check-ins
                </span>
              </Link>
            ) : (
              <>
                <Link className="flex pl-[25px]" href="/api/auth/login">
                  <Image
                    src="/userperson.svg"
                    alt="log in route"
                    width={16}
                    height={16}
                    className="text-[#687792]"
                    style={{ width: 16, height: 16 }}
                  />
                  <span className="font-medium text-sm text-[#687792] pl-1 capitalize">
                    log in
                  </span>
                </Link>
              </>
            )}
            <h3 className="uppercase font-bold text-[12px] p-3 mt-1 ml-1 text-[#4C5769]">
              teams
            </h3>
            {userteams ? (
              userteams?.map((team: any) => (
                <Link
                  key={team.team_id}
                  className={`flex ml-3 mr-3 w-auto h-10 p-3 items-center ${CurrentPage === 'teamPage' && Currentteam === team.team_id ? 'bg-[#5FABB1] bg-opacity-25 rounded-md' : ''}`}
                  href={`/team-dashboard/${team.team_id}`}
                >
                  <Image
                    src="/teamfolder.svg"
                    alt="team route"
                    width={16}
                    height={16}
                    style={{ width: 16, height: 16 }}
                  />
                  <span className="font-medium text-sm text-[#687792] pl-1 capitalize">
                    Team: <TeamFetch teamID={team.team_id} />
                  </span>
                </Link>
              ))
            ) : (
              <i className="ml-3 mr-3 w-auto h-10 p-3 items-center">
                No teams found
              </i>
            )}
          </div>
        </div>
        <div className="laptop:flex hidden flex-col items-center">
          <ModalBtnHandler
            user_id={user_id as string}
            createTeamMode={'secondary'}
            joinTeamMode={'primary'}
          />
          <div className="flex w-full h-[62px] items-center justify-between p-2 shadow-md border-t-[1px] border-gray-100">
            {user && (
              <UserIcon
                userID={user?.user_id}
                firstName={user?.first_name || ''}
                lastName={user?.lastname || ''}
                className="w-[40px]"
                picture={user?.picture}
              />
            )}
            <p className="capitalize text-center">
              <UserNameFetch userID={user_id} />
            </p>
            <UserOptions user_id={user_id as string} />
          </div>
        </div>
      </aside>
    </nav>
  );
};

export default WebNavigation;
