'use client';
import React, { useState } from 'react';

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

const SessionComments = ({
  sessionComments,
}: {
  sessionComments: SessionEntry[];
}) => {
  // const [sessionTeamData, setSessionTeamData] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <article>
      <ul>
        {sessionComments
          .slice() // Make a copy of the array to avoid mutating the original data
          .sort(
            (a, b) =>
              new Date(a.session_date).getTime() -
              new Date(b.session_date).getTime(),
          ) // Sort by session date
          .map((session, index) => (
            <li key={index}>
              {new Date(session.session_date).toLocaleDateString()} -{' '}
              {session.comment}
            </li>
          ))}
      </ul>
    </article>
  );
};

export default SessionComments;
