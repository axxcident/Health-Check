import React from 'react';
import WebDashBoard from './dashboard';
import WebNavigation from '../../_components/web-navigation';
import WebHeader from '../../_components/web-header';
import { getUserIdByEmail } from '../../lib/utils';
import {
  AppRouterPageRouteOpts,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import MobileNav from '@/app/_components/mobile-nav';
import { userTeams } from '@/app/lib/actions';
import { sql } from '@vercel/postgres';

export async function generateMetadata({ params }: { params: TeamParams }) {
  return {
    title: 'Team Dashboard',
    description: `Dashboard for Team: ${params.team_id}`,
  };
}

const TeamDashboardSchema = z.object({
  team_id: z.string(),
});

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

type TeamParams = z.infer<typeof TeamDashboardSchema>;

const TeamdashBoard: (
  obj: AppRouterPageRouteOpts,
) => Promise<React.ReactElement> = async ({ params }) => {
  if (!params || !('team_id' in params)) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }
  const teamPage: string = 'teamPage';
  const { user_id } = await getUserIdByEmail();
  let userteams = await userTeams(user_id as string);

  let datan = await sql`SELECT
  cs.session_id,
  cs.team_id,
  cs.session_date,
  ce.entry_id,
  ce.happiness,
  ce.productivity,
  ce.stress,
  ce.comment,
  ce.user_id
FROM
  checkin_sessions cs
LEFT JOIN
  checkin_entries ce ON cs.session_id = ce.session_id
WHERE
  cs.team_id = ${params.team_id as string};`;

  const formattedLogs: SessionLogs[] = datan.rows.map((row: any) => ({
    session_id: row.session_id,
    team_id: row.team_id,
    session_date: new Date(row.session_date),
    entry_id: row.entry_id,
    happiness: row.happiness,
    productivity: row.productivity,
    stress: row.stress,
    comment: row.comment,
    user_id: row.user_id,
  }));

  return params.team_id ? (
    <main>
      <MobileNav
        user_id={user_id as string}
        CurrentPage={'teamPage'}
        userteams={userteams}
        team_id={params.team_id as string}
      />
      <WebNavigation
        CurrentPage={teamPage}
        Currentteam={params.team_id as string}
        user_id={user_id}
      />
      <section className="laptop:ml-[225px] bg-[#F6F8FA] min-h-screen">
        <WebHeader
          teamID={params.team_id as string}
          CurrentPage="teampage"
          userId={user_id}
        />
        <WebDashBoard
          teamID={params.team_id as string}
          formattedLogs={formattedLogs}
          userID={user_id}
        />
      </section>
    </main>
  ) : (
    <main>
      <section className="laptop:ml-[225px] bg-[#F6F8FA] min-h-screen">
        <p>No team id found</p>
      </section>
    </main>
  );
};

export default withPageAuthRequired(TeamdashBoard, {
  returnTo: (obj: AppRouterPageRouteOpts) => {
    if (obj && obj.params && 'team_id' in obj.params) {
      const { team_id } = obj.params;
      return `${process.env.NEXT_PUBLIC_BASE_URL}/team-dashboard/${team_id}`;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/`;
  },
});
