import React, { use, useEffect } from 'react';
import { joinTeamAction, leaveTeam } from '../lib/actions';
import { useFormState, useFormStatus } from 'react-dom';
import BTN from './btn';
import Image from 'next/image';
import FormBTN from './formBTN';
import ModalCloseBTN from './modal-close-btn';

type ModalProps = {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  user_id?: string;
  className?: string;
  joinTeamModalWrapper?: string;
};

type Team = {
  team_id: string;
  team_name: string;
  isUserTeam?: boolean;
};

const JoinTeamModal: React.FC<ModalProps> = ({
  toggleModal,
  user_id,
  className,
  joinTeamModalWrapper,
}) => {
  const [teams, setTeams] = React.useState<Team[] | any>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const initialState = {
    message: '',
  };

  const [state, formAction] = useFormState(joinTeamAction, initialState);

  const overlayClick = () => {
    toggleModal(false);
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams`,
      );
      if (response.ok) {
        const data = await response.json();
        const fetchedTeams: Team[] = data.teams;

        const userTeamsResponse = await fetch(
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
        if (userTeamsResponse.ok) {
          const userTeamsData = await userTeamsResponse.json();
          const userTeams = userTeamsData.members.map(
            (team: any) => team.team_id,
          );

          const enrichedTeams = fetchedTeams.map((team) => {
            if (userTeams.includes(team.team_id)) {
              return { ...team, isUserTeam: true };
            }
            return team;
          });

          setTeams(enrichedTeams);
        } else {
          console.error('Error fetching user teams:', userTeamsResponse.status);
        }
      } else {
        console.error('Error fetching teams:', response.status);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);
  // }, [user_id]);

  useEffect(() => {
    if (
      state.message === 'User added to team' ||
      state.message === 'User removed from team' ||
      state.message !== ''
    ) {
      console.log('state.message:', state.message);
      fetchTeams();
    }
  }, [state.message]);
  // }, [state]);

  return (
    <>
      <section
        onClick={overlayClick}
        className="absolute z-40 cursor-default left-0 top-0 w-screen h-screen bg-black opacity-50"
      ></section>
      <div
        className={`absolute z-50 cursor-default left-[35vw] top-[25%] h-3/5 max-h-[500px] w-[40vw] max-w-[450px] bg-white rounded-xl ${className}`}
      >
        <header className="bg-[#FEE0DF] flex p-4 justify-between items-center rounded-tl-lg rounded-tr-lg">
          <h3 className="font-medium text-4xl text-[#393e46]">Join Team</h3>
          <ModalCloseBTN setModal={toggleModal} />
        </header>
        <div
          className={`max-h-[427px] overflow-y-auto scroll-p-1 ${joinTeamModalWrapper}`}
        >
          {loading ? (
            <div className="w-full h-72 flex justify-center items-center opacity-30">
              <Image
                src="/loading_circle.svg"
                alt="loading icon"
                height={100}
                width={100}
                style={{ width: 100, height: 100 }}
                className="animate-spin text-center w-full h-full"
              />
            </div>
          ) : (
            <>
              {teams?.map((team: Team) => (
                <div
                  key={team.team_id}
                  className="p-4 border-b border-[#E8E7E7] flex justify-between items-center"
                >
                  <h4 className="font-medium text-xl text-[#393e46] capitalize">
                    {team.team_name}
                  </h4>
                  {team.isUserTeam ? (
                    <>
                      <FormBTN
                        fetchTeams={fetchTeams}
                        team_id={team.team_id}
                        user_id={user_id as string}
                        toggleModal={toggleModal}
                      />
                    </>
                  ) : (
                    <>
                      <form action={formAction}>
                        <input type="hidden" name="user_id" value={user_id} />
                        <BTN
                          text={'Join'}
                          mode="secondary"
                          type="submit"
                          value={team.team_id}
                          name="team_id"
                          id="team_id"
                          toggleModal={toggleModal}
                          className="rounded-md p-2 mt-2 cursor-pointer relative"
                        />
                      </form>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default JoinTeamModal;
