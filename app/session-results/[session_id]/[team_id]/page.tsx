import React from 'react';
import WebNavigation from '@/app/_components/web-navigation';
import SessionCheckinResults from './session-checkin-results';
import { getUserIdByEmail } from '@/app/lib/utils';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  AppRouterPageRouteOpts,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import MobileNav from '@/app/_components/mobile-nav';
import { userTeams } from '@/app/lib/actions';
import { FetchSessionResults } from './actions';
import WebHeader from '@/app/_components/web-header';
import { revalidatePath } from 'next/cache';

export async function generateMetadata({ params }: { params: SessionParams }) {
  return {
    title: 'Session Check-in results',
    description: `Session Check-in results for session ${params.session_id}`,
  };
}

const SessionSchema = z.object({
  session_id: z.string(),
  team_id: z.string(),
});

type SessionParams = z.infer<typeof SessionSchema>;

type SessionEntries = {
  entry_id: string;
  session_id: string;
  user_id: string;
  team_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  comment: string;
};

const SessionResults: (
  obj: AppRouterPageRouteOpts,
) => Promise<React.ReactElement> = async ({ params }) => {
  if (!params || !('team_id' in params || 'session_id' in params)) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }

  const ses = params.session_id as string;

  const { user_id } = await getUserIdByEmail();
  let userteams = await userTeams(user_id as string);

  let [sessionData] = await FetchSessionResults(ses as string);

  return (
    <main>
      <MobileNav
        user_id={user_id as string}
        CurrentPage={'teamPage'}
        userteams={userteams}
        team_id={params.team_id as string}
      />
      <WebNavigation
        CurrentPage="teamPage"
        Currentteam={params.team_id as string}
        user_id={user_id}
      />
      <section className="laptop:ml-[225px] bg-[#F6F8FA] min-h-screen">
        <WebHeader teamID={params.team_id as string} CurrentPage="teampage" />
        <SessionCheckinResults
          teamID={params.team_id as string}
          session_id={params.session_id as string}
          sessionData={sessionData}
        />
      </section>
    </main>
  );
};

export default withPageAuthRequired(SessionResults, {
  returnTo: (obj: AppRouterPageRouteOpts) => {
    if (
      obj &&
      obj.params &&
      'team_id' in obj.params &&
      'session_id' in obj.params
    ) {
      const { session_id, team_id } = obj.params;
      return `${process.env.NEXT_PUBLIC_BASE_URL}/session-results/${session_id}/${team_id}`;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/`;
  },
});
