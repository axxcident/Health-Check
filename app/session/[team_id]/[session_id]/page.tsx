import React from 'react';
import WebNavigation from '@/app/_components/web-navigation';
import { sql } from '@vercel/postgres';
import SessionForm from './session-form';
import { redirect } from 'next/navigation';
import { getUserIdByEmail } from '@/app/lib/utils';
import { z } from 'zod';
import {
  AppRouterPageRouteOpts,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import MobileNav from '@/app/_components/mobile-nav';
import { userTeams } from '@/app/lib/actions';

export async function generateMetadata({ params }: { params: SessionParams }) {
  return {
    title: 'Sesssion Checkin',
    description: `Session Checkin for session ${params.session_id}`,
  };
}

const SessionSchema = z.object({
  team_id: z.string(),
  session_id: z.string(),
});

type SessionParams = z.infer<typeof SessionSchema>;

type SessionEntries = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string;
  password: string;
  lastname: string;
};

const Session: (
  obj: AppRouterPageRouteOpts,
) => Promise<React.ReactElement> = async ({ params }) => {
  if (!params || !('team_id' in params || 'session_id' in params)) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }

  const { user_id } = await getUserIdByEmail();
  let userteams = await userTeams(user_id as string);

  let sessionData: SessionEntries | any;
  const ses = params.session_id as string;

  if (ses) {
    let datan =
      await sql`SELECT * FROM checkin_entries WHERE Session_id = ${ses};`;
    const { rows: SessionRows } = datan;
    sessionData = SessionRows;

    if (sessionData.length > 0) {
      for (let i = 0; i < sessionData.length; i++) {
        if (sessionData[i].user_id === user_id) {
          redirect(`/session-results/${ses as string}/${params.team_id}`);
        }
      }
    }
  } else {
    console.error('Session ID not found or has no value');
    return (
      <main className="">
        <section className="w-screen h-screen flex justify-center items-center">
          <p className="font-semiBold">Error fetching session entries</p>
        </section>
      </main>
    );
  }

  return (
    <main className="">
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
      <SessionForm
        sessionId={params.session_id as string}
        teamID={params.team_id as string}
        user_id={user_id}
      />
    </main>
  );
};

export default withPageAuthRequired(Session, {
  returnTo: (obj: AppRouterPageRouteOpts) => {
    if (
      obj &&
      obj.params &&
      'team_id' in obj.params &&
      'session_id' in obj.params
    ) {
      const { team_id, session_id } = obj.params;
      return `${process.env.NEXT_PUBLIC_BASE_URL}/session/${team_id}/${session_id}`;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/`;
  },
});
