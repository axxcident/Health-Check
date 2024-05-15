'use client';
import CustomComment from '@/app/session-results/[session_id]/[team_id]/custom-comment';
import BarStatistics from './bar-statistics';
import { useState, useEffect, use } from 'react';

type SessionCheckinResultsProps = {
  session_id: string;
  sessionData: SessionCheckinEntries[];
  teamID: string;
};

type SessionCheckinEntries = {
  entry_id: string;
  session_id: string;
  user_id: string;
  team_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

const SessionCheckinResults = ({
  teamID,
  session_id,
  sessionData,
}: SessionCheckinResultsProps) => {
  const [newSessionData, setNewSessionData] = useState<SessionCheckinEntries[]>(
    sessionData || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkin-entries?session_id=${session_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.checkin_entries.length !== newSessionData.length) {
            setNewSessionData(data.checkin_entries);
          }
        } else {
          console.error('Error with page-test function:', response.status);
        }
      } catch (error) {
        console.error('Error fetching session entries:', error);
      }
    };

    const intervalId = setInterval(fetchData, 12000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 300000);

    // Initial fetch
    fetchData();

    return () => clearInterval(intervalId);
  }, [session_id, newSessionData]);

  try {
    return (
      <>
        <article className="flex flex-col justify-center min-h-[89vh] items-center w-full pt-12">
          <BarStatistics session_id={session_id} />
          <div className="laptop:w-[80%] w-[98%] mt-4">
            {newSessionData.map((entry: SessionCheckinEntries) => (
              <CustomComment
                key={entry.entry_id + entry.session_id + entry.user_id}
                user_id={entry.user_id}
                happiness={entry.happiness}
                productivity={entry.productivity}
                stress={entry.stress}
                komment={entry.comment}
              />
            ))}
          </div>
        </article>
      </>
    );
  } catch (error) {
    console.error('Error fetching session entries:', error);
    return (
      <>
        <article className="w-screen flex justify-center items-center">
          <p className="font-semiBold">Error fetching session entries</p>
        </article>
      </>
    );
  }
};

export default SessionCheckinResults;
