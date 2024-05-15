'use client';
import TeamStatistics from './team-statistics';
import SessionLogs from './session-logs';
import Image from 'next/image';
import HeaderModalSessionHandler from '@/app/_components/header-modal-session-handler';
import { useEffect, useRef, useState } from 'react';
import Checkbox from '@/app/_components/checkbox';
import DateFilterInput from '@/app/_components/date-filter-input';

type TeamFetchProp = {
  teamID?: string;
  userID?: string;
  formattedLogs?: SessionLogs[];
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

type SessionEntry = {
  session_id: string;
  team_id: string;
  session_date: string;
  entry_id: string;
  user_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

const DashBoard = ({ teamID, userID, formattedLogs }: TeamFetchProp) => {
  const [sessionTeamData, setSessionTeamData] = useState<SessionEntry[]>([]);
  const [copySessionTeamData, setCopySessionTeamData] = useState<
    SessionEntry[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [happinessChecked, setHappinessChecked] = useState(true);
  const [productivityChecked, setProductivityChecked] = useState(true);
  const [stressChecked, setStressChecked] = useState(true);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const getTeamData = async () => {
      setLoading(true);
      try {
        if (teamID) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkin-entries?team_id=${teamID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          if (response.ok) {
            const sessionTeamData = await response.json();
            setCopySessionTeamData(sessionTeamData.checkin_entries);
            setSessionTeamData(sessionTeamData.checkin_entries);
            setLoading(false);
          } else {
            console.error(
              'Error fetching team sessions entry data:',
              response.status,
            );
          }
        }
      } catch (error) {
        console.error('Error fetching teams sessions entry data:', error);
      }
    };
    getTeamData();
  }, [teamID, userID, formRef]);

  useEffect(() => {
    const timeFilteredSessions = copySessionTeamData.filter((session) => {
      const sessionDate = new Date(session.session_date).getTime();
      const startDateTime = startDate ? new Date(startDate).getTime() : 0;
      const endDateTime = endDate
        ? new Date(endDate).getTime()
        : Number.MAX_SAFE_INTEGER;
      return sessionDate >= startDateTime && sessionDate <= endDateTime;
    });
    const newSessionTeamInfo = timeFilteredSessions.map((session: any) => {
      const updatedSession: any = { ...session };
      if (!happinessChecked) delete updatedSession.happiness;
      if (!productivityChecked) delete updatedSession.productivity;
      if (!stressChecked) delete updatedSession.stress;
      return updatedSession;
    });
    setSessionTeamData(newSessionTeamInfo);
  }, [
    startDate,
    endDate,
    copySessionTeamData,
    happinessChecked,
    productivityChecked,
    stressChecked,
  ]);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSessions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === 'happiness' && checked === false) {
      setHappinessChecked(!happinessChecked);
      const newSessionTeamInfo = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        delete updatedSession.happiness;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamInfo);
    } else if (name === 'happiness' && checked === true) {
      setHappinessChecked(!happinessChecked);
      const newSessionTeamInfo = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        updatedSession.happiness =
          copySessionTeamData.find((s) => s.entry_id === session.entry_id)
            ?.happiness ?? null;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamInfo);
    } else if (name === 'productivity' && checked === false) {
      setProductivityChecked(!productivityChecked);
      const newSessionTeamInfo = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        delete updatedSession.productivity;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamInfo);
    } else if (name === 'productivity' && checked === true) {
      setProductivityChecked(!productivityChecked);
      const newSessionTeamInfo = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        updatedSession.productivity =
          copySessionTeamData.find((s) => s.entry_id === session.entry_id)
            ?.productivity ?? null;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamInfo);
    } else if (name === 'stress' && checked === false) {
      setStressChecked(!stressChecked);
      const newSessionTeamData = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        delete updatedSession.stress;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamData);
    } else if (name === 'stress' && checked === true) {
      setStressChecked(!stressChecked);
      const newSessionTeamData = sessionTeamData.map((session: any) => {
        const updatedSession: any = { ...session };
        updatedSession.stress =
          copySessionTeamData.find((s) => s.entry_id === session.entry_id)
            ?.stress ?? null;
        return updatedSession;
      });
      setSessionTeamData(newSessionTeamData);
    }
  };

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="laptop:hidden w-[90%]">
        <HeaderModalSessionHandler
          team_id={teamID as string}
          modalClassname="!w-full !h-[250px] !left-0"
          BtnClassName="mt-4 w-full"
        />
      </div>
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
          <form
            ref={formRef}
            className="w-full flex justify-center items-center flex-col laptop:flex-row mt-6"
          >
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
          {teamID && (
            <TeamStatistics
              teamID={teamID}
              sessionTeamData={sessionTeamData}
              loading={loading}
            />
          )}
          {userID && formattedLogs && (
            <SessionLogs {...{ userID, logs: formattedLogs }} />
          )}
        </>
      )}
    </section>
  );
};

export default DashBoard;
