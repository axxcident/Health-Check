'use client';
import React, { useState, useEffect } from 'react';
import UserIcon from './user-icon';
import Image from 'next/image';
import UserNameFetch from './user-name-fetch';
import ModalCloseBTN from './modal-close-btn';
import Link from 'next/link';
import TeamFetch from './team-fetch';
import ModalBtnHandler from './modal-btn-handler';
import BTN from './btn';
import TeamOptions from './team-options';

type User = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string | null;
  password: string | null;
  lastname: string;
  picture: string;
};

type Team = {
  user_id: string;
  team_id: string;
};

type MobileNavProps = {
  user_id: string;
  CurrentPage?: string;
  userteams?: Team[];
  team_id?: string;
};

const MobileNav = ({
  user_id,
  CurrentPage,
  userteams,
  team_id,
}: MobileNavProps) => {
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user?User_id=${user_id}`,
        );
        if (response.ok) {
          const data = await response.json();
          let fetchedUser = data.individual_user;
          if (fetchedUser.first_name.includes('.')) {
            const firstNameParts = fetchedUser.first_name.split('.');
            const formattedFirstName = firstNameParts.join(' ');
            fetchedUser = { ...fetchedUser, first_name: formattedFirstName };
          }
          setUser(fetchedUser);
        } else {
          console.error('Error fetching user:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (user_id) {
      fetchUser();
    }
  }, [user_id, team_id]);

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setModal(!modal);
  };

  const overlayClick = () => {
    console.log('overlay clicked');
    setModal(false);
  };

  return (
    <>
      <nav className="relative laptop:hidden w-full h-full flex items-center p-4 justify-between bg-white shadow-md border-b-2 border-gray-100">
        <div className="flex items-center text-center justify-center">
          {CurrentPage === 'userPage' && user_id ? (
            <h3 className="capitalize font-medium text-4xl laptop:font-semibold laptop:text-6xl text-[#393E46]">
              <UserNameFetch userID={user_id} />
            </h3>
          ) : CurrentPage === 'teamPage' && team_id ? (
            <>
              <h3 className="capitalize font-medium text-2xl laptop:font-semibold laptop:text-6xl text-[#393E46]">
                <TeamFetch teamID={team_id} />
              </h3>
              <TeamOptions
                user_id={user_id as string}
                team_id={team_id}
                className="!h-8 !w-8 !mt-0"
                modalClassName="!top-8 !left-1"
              />
            </>
          ) : (
            <i>No Team nor User found</i>
          )}
        </div>
        <div className="flex">
          <UserIcon
            userID={user?.user_id as string}
            firstName={user?.first_name || ''}
            lastName={user?.lastname || ''}
            className="w-[40px]"
            picture={user?.picture}
          />
          <button type="button" onClick={handleMenuClick}>
            <Image
              src={'/mobile_menu.png'}
              className="block ml-8 w-auto h-auto mt-1"
              alt="Menu icon"
              height={36}
              width={32}
              style={{ width: 32, height: 36 }}
            />
          </button>
        </div>
        {modal && (
          <>
            <div className="absolute z-10 top-0 left-0 h-full w-screen flex flex-col justify-end">
              <div
                className="fixed z-20 top-0 left-0 w-full h-full bg-black opacity-50"
                onClick={overlayClick}
              ></div>
              <aside className="fixed bottom-0 flex flex-col z-30 w-full h-[80%] bg-white rounded-tr-md rounded-t-md overflow-y-auto">
                <div className="flex flex-col w-full">
                  <div className="relative w-full h-[120px] shadow-md border-b border-black border-opacity-25">
                    <ModalCloseBTN
                      setModal={setModal}
                      className="absolute top-4 right-4 z-40"
                    />
                    <Image
                      src="/health-check-in.png"
                      alt="health check in logo"
                      width={1024}
                      height={1024}
                      className="object-cover object-[center_47%] w-full h-full transform scale-[1]"
                      priority={true}
                    />
                  </div>
                  <div className="text-black h-full">
                    <h3 className="uppercase font-bold text-[12px] p-3 mt-1 ml-1 text-[#4C5769]">
                      personal
                    </h3>
                    <div className="flex p-4 gap-10">
                      {user?.user_id && (
                        <Link
                          className={`w-full h-10 rounded-md capitalize`}
                          href={`/user-dashboard/${user?.user_id}`}
                        >
                          <span
                            className={`text-sm font-semibold border border-opacity-20 shadow-lg hover:shadow-xl focus:shadow-lg focus:outline-none rounded-md w-full h-12 flex justify-center items-center ${CurrentPage === 'userPage' ? 'text-white bg-[#393E46]' : 'text-[#393E46] bg-white focus:bg-slate-300'}`}
                          >
                            Your check-ins
                          </span>
                        </Link>
                      )}
                      <BTN
                        type="submit"
                        text="Log out"
                        mode="secondary"
                        className="w-full h-12"
                        href="/api/auth/logout"
                      />
                    </div>
                    <h3 className="uppercase font-bold text-[12px] p-3 mt-2 -mb-4 ml-1 text-[#4C5769]">
                      teams
                    </h3>
                    <div className="my-3">
                      {userteams &&
                        userteams?.map((team: Team) => (
                          <Link
                            key={team.team_id}
                            className={`flex my-5 ml-3 mr-3 w-auto h-10 rounded-md capitalize items-center ${CurrentPage === 'teamPage' && team_id === team.team_id ? 'bg-[#5FABB1] bg-opacity-25 rounded-md' : ''}`}
                            href={`/team-dashboard/${team.team_id}`}
                          >
                            <span
                              className={`text-sm font-semibold border border-opacity-20 shadow-lg hover:shadow-xl focus:shadow-lg focus:outline-none rounded-md w-full h-12 flex justify-center items-center ${CurrentPage === 'teamPage' && team_id === team.team_id ? 'text-white bg-[#393E46]' : 'text-[#393E46] bg-white focus:bg-slate-300'}`}
                            >
                              <Image
                                src="/teamfolder.svg"
                                alt="team route"
                                width={16}
                                height={16}
                                style={{ width: 16, height: 16 }}
                                className="mr-2"
                              />
                              Team: <TeamFetch teamID={team.team_id} />
                            </span>
                          </Link>
                        ))}
                    </div>
                    <div className="">
                      <h3 className="uppercase font-bold text-[12px] p-3 mt-2 -mb-4 ml-1 text-[#4C5769]">
                        options
                      </h3>
                      <div className="flex p-4 gap-10">
                        <ModalBtnHandler
                          user_id={user_id}
                          createTeamMode={'secondary'}
                          joinTeamMode={'secondary'}
                          createteamClassName={
                            '!left-[0%] !top-[0%] h-[65%] max-h-[600px] w-screen'
                          }
                          createFormClassname={'flex-col mt-6'}
                          createWrapperClassName={'w-[95%] -ml-0'}
                          createInputClassname={'h-24 text-start'}
                          createBTNClassname={'w-[95%] max-w-none'}
                          jointeamClassName={
                            '!left-[0%] !top-[0%] h-[70%] max-h-[600px] w-screen'
                          }
                          joinTeamModalWrapper={'bg-white rounded-b-md'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default MobileNav;
