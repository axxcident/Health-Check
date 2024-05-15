'use client';
import UserLogs from './user-logs';
import UserStatistics from './user-statistics';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TeamFetch from '@/app/_components/team-fetch';
import Checkbox from '@/app/_components/checkbox';
import DateFilterInput from '@/app/_components/date-filter-input';

type TeamFetchProp = {
  teamID?: string;
  userID?: string;
  teams: Team[];
};

type Team = {
  user_id: string;
  team_id: string;
};

type SessionLogs = {
  session_id: string;
  team_id: string;
  session_date: Date;
  entry_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
  user_id: string;
};

type UserSession = {
  session_id: string;
  team_id: string;
  session_date: string;
  entry_id: string;
  happiness: number | null;
  productivity: number | null;
  stress: number | null;
  comment: string;
};

const UserDashBoard = ({ teamID, userID, teams }: TeamFetchProp) => {
  const [formatLogs, setFormatLogs] = useState<SessionLogs[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [team_id, setTeamID] = useState<string | null>(teamID as string);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [copyUserSessions, setCopyUserSessions] = useState<UserSession[]>([]);

  const [happinessChecked, setHappinessChecked] = useState(true);
  const [productivityChecked, setProductivityChecked] = useState(true);
  const [stressChecked, setStressChecked] = useState(true);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamId = event.target.value;
    setTeamID(selectedTeamId);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    const timeFilteredSessions = copyUserSessions.filter((session) => {
      const sessionDate = new Date(session.session_date).getTime();
      const startDateTime = startDate ? new Date(startDate).getTime() : 0;
      const endDateTime = endDate
        ? new Date(endDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      return sessionDate >= startDateTime && sessionDate <= endDateTime;
    });

    const newSessionInfo = timeFilteredSessions.map((session: any) => {
      if (!happinessChecked) {
        session = { ...session, happiness: null };
      }
      if (!productivityChecked) {
        session = { ...session, productivity: null };
      }
      if (!stressChecked) {
        session = { ...session, stress: null };
      }
      return session;
    });
    setUserSessions(newSessionInfo);
  }, [
    startDate,
    endDate,
    copyUserSessions,
    happinessChecked,
    productivityChecked,
    stressChecked,
  ]);

  useEffect(() => {
    if (teamID) {
      setTeamID(teamID as string);
    }
    setTeamID(teamID as string);
  }, [teamID]);

  useEffect(() => {
    const fetchTeamSessions = async () => {
      if (!userID) {
        console.error('No user found');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/team-sessions?team_id=${team_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setFormatLogs(data.sessions);
          setTeamID(team_id);
        } else {
          setFormatLogs([]);
          console.log(
            'No sessions to display for current user',
            response.status,
          );
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamSessions();
  }, [userID, teams, teamID, team_id, formRef]);

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!userID) {
        console.error('No user found');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/your-checkins`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userID,
              team_id: team_id,
            }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          const sortedSessions = data.your_check_ins.sort(
            (a: any, b: any) =>
              new Date(a.session_date).getTime() -
              new Date(b.session_date).getTime(),
          );
          setUserSessions(sortedSessions);
          setCopyUserSessions(sortedSessions);
        } else {
          setUserSessions([]);
          console.log(
            'Expected Error for new users. No sessions to display for current user',
            response.status,
          );
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessions();
  }, [userID, teamID, team_id, formRef]);

  const handleSessions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'happiness' && checked === false) {
      setHappinessChecked(!happinessChecked);
      const newUserSessions = userSessions.map((session: any) => {
        session = { ...session, happiness: null };
        return session;
      });
      setUserSessions(newUserSessions);
    } else if (name === 'happiness' && checked === true) {
      const newUserSessions = userSessions.map((session: any) => {
        session = {
          ...session,
          happiness:
            copyUserSessions.find((s) => s.session_id === session.session_id)
              ?.happiness ?? null,
        };
        return session;
      });
      setHappinessChecked(!happinessChecked);
      setUserSessions(newUserSessions);
    } else if (name === 'productivity' && checked === false) {
      setProductivityChecked(!productivityChecked);
      const newUserSessions = userSessions.map((session: any) => {
        session = { ...session, productivity: null };
        return session;
      });
      setUserSessions(newUserSessions);
    } else if (name === 'productivity' && checked === true) {
      setProductivityChecked(!productivityChecked);
      const newUserSessions = userSessions.map((session: any) => {
        session = {
          ...session,
          productivity:
            copyUserSessions.find((s) => s.session_id === session.session_id)
              ?.productivity ?? null,
        };
        return session;
      });
      setUserSessions(newUserSessions);
    } else if (name === 'stress' && checked === false) {
      setStressChecked(!stressChecked);
      const newUserSessions = userSessions.map((session: any) => {
        session = { ...session, stress: null };
        return session;
      });
      setUserSessions(newUserSessions);
    } else if (name === 'stress' && checked === true) {
      setStressChecked(!stressChecked);
      const newUserSessions = userSessions.map((session: any) => {
        session = {
          ...session,
          stress:
            copyUserSessions.find((s) => s.session_id === session.session_id)
              ?.stress ?? null,
        };
        return session;
      });
      setUserSessions(newUserSessions);
    }
  };

  return (
    <article className="w-full h-full flex flex-col justify-center items-start my-5 laptop:my-auto">
      <form
        ref={formRef}
        className="w-full flex justify-center items-center flex-col"
      >
        <input type="hidden" name="user_id" id="user_id" value={userID} />
        <select
          onChange={handleSelectChange}
          name="team_id"
          id="team_id"
          className="flex w-[80%] mx-10 laptop:w-[200px] h-[50px] mt-4 rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none"
        >
          <option value={team_id as string}>Select a Team</option>
          {teams.map((team: any) => (
            <option
              key={team.team_id}
              value={team.team_id}
              className="w-full h-full rounded-md p-2 capitalize"
            >
              <TeamFetch teamID={team.team_id} />
            </option>
          ))}
        </select>
        <div className="flex laptop:flex-col items-center">
          <div className="flex laptop:flex-row flex-col items-end">
            <Checkbox
              label="Happiness"
              name="happiness"
              checked={happinessChecked}
              onChange={handleSessions}
            />
            <Checkbox
              label="Productivity"
              name="productivity"
              checked={productivityChecked}
              onChange={handleSessions}
            />
            <Checkbox
              label="Stress"
              name="stress"
              checked={stressChecked}
              onChange={handleSessions}
            />
          </div>
          <div className="flex laptop:flex-row flex-col">
            <DateFilterInput
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              name="startDate"
            />
            <DateFilterInput
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              name="endDate"
            />
          </div>
        </div>
      </form>

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
          {formatLogs.length > 0 ? (
            <>
              {userID && (
                <UserStatistics
                  userID={userID}
                  teamID={team_id as string}
                  userSessions={userSessions}
                />
              )}
              {userID && formatLogs && (
                <UserLogs {...{ userID, logs: formatLogs }} />
              )}
            </>
          ) : (
            <div className="h-[80vh] w-full flex flex-col justify-center items-center">
              <i>No logs nor chart info found</i>
              <p>
                Go to your team page(s) and create new sessions to get started
              </p>
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default UserDashBoard;
