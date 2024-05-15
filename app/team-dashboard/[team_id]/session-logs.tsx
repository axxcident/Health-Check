'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type UserProp = {
  userID?: string;
  logs?: SessionLog[];
};

type SessionLog = {
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

const SessionLogs = ({ userID, logs }: UserProp) => {
  const [userFilledSessions, setUserFilledSessions] = useState<SessionLog[]>(
    [],
  );
  const [missedSessions, setMissedSessions] = useState<SessionLog[]>([]);

  useEffect(() => {
    if (logs) {
      const filledSessions = logs.filter(
        (session) => session.user_id === userID,
      );
      const otherSessions = logs.filter(
        (session) => session.user_id !== userID,
      );

      setUserFilledSessions(filledSessions);

      const uniqueSessions = otherSessions.filter(
        (session, index, self) =>
          index === self.findIndex((s) => s.session_id === session.session_id),
      );
      const filteredUniqueSessions = uniqueSessions.filter((uniqueSession) => {
        return filledSessions.every(
          (filledSession) =>
            filledSession.session_id !== uniqueSession.session_id,
        );
      });
      setMissedSessions(filteredUniqueSessions);
    }
  }, [logs, userID]);

  return (
    <>
      {logs && (
        <article className="laptop:w-[90%] w-full mt-6 flex flex-col laptop:block laptop:ml-[42px]">
          {missedSessions.length > 0 && (
            <>
              <h4 className="p-1 font-semibold laptop:text-lg laptop:ml-0 ml-[5%]">
                Missed sessions:
              </h4>
              <div className="flex flex-col items-center">
                {missedSessions
                  .sort(
                    (a, b) =>
                      new Date(b.session_date).getTime() -
                      new Date(a.session_date).getTime(),
                  )
                  .map((session) => (
                    <Link
                      href={`/session/${session.team_id}/${session.session_id}`}
                      key={`${session.session_id}-${session.entry_id}`}
                      className="flex w-[90%] laptop:w-full justify-between p-4 bg-white mb-2 cursor-pointer rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none"
                    >
                      <p>
                        Date: {new Date(session.session_date).toLocaleString()}
                      </p>
                      <div className="flex items-center">
                        <p className="mr-3">Not Filled in</p>
                        <Image
                          src="/options.svg"
                          alt="options"
                          width={14}
                          height={3}
                          style={{ width: 14, height: 3 }}
                        />
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}
          {userFilledSessions.length > 0 && (
            <>
              <h4 className="p-1 font-medium pt-2 laptop:text-lg laptop:ml-0 ml-[5%]">
                Filled in sessions:
              </h4>
              <div className="flex flex-col items-center">
                {userFilledSessions
                  .sort(
                    (a, b) =>
                      new Date(b.session_date).getTime() -
                      new Date(a.session_date).getTime(),
                  )
                  .map((session) => (
                    <Link
                      href={`/session-results/${session.session_id}/${session.team_id}`}
                      key={`${session.entry_id}-${session.session_id}`}
                      className="flex w-[90%] laptop:w-full justify-between p-4 bg-white mb-2 cursor-pointer rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none"
                    >
                      <p className="">
                        Date: {new Date(session.session_date).toLocaleString()}
                      </p>
                      <div className="flex items-center">
                        <p className="mr-3">Filled in</p>
                        <Image
                          src="/options.svg"
                          alt="options"
                          width={14}
                          height={3}
                          style={{ width: 14, height: 3 }}
                        />
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </article>
      )}
    </>
  );
};

export default SessionLogs;
