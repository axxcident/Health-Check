import WebHeader from '@/app/_components/web-header';
import WebNavigation from '@/app/_components/web-navigation';
import React from 'react';
import UserDashBoard from './user-dashboard';
import { redirect } from 'next/navigation';
import {
  AppRouterPageRouteOpts,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import { userTeams } from '@/app/lib/actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import MobileNav from '@/app/_components/mobile-nav';

type Team = {
  user_id: string;
  team_id: string;
};

export async function generateMetadata({ params }: { params: UserParams }) {
  return {
    title: 'User Dashboard',
    description: `Dashboard for User: ${params.user_id}`,
  };
}

const UserDashboardSchema = z.object({
  user_id: z.string(),
});

type UserParams = z.infer<typeof UserDashboardSchema>;

const UserDashboard: (
  obj: AppRouterPageRouteOpts,
) => Promise<React.ReactElement> = async ({ params }) => {
  const userPage: string = 'userPage';
  let teamID: string = '';

  if (!params || !('user_id' in params)) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }
  revalidatePath(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${params.user_id}`,
  );

  let userteams: Team[] = await userTeams(params.user_id as string);

  try {
    teamID = userteams[0].team_id;
  } catch (error) {
    teamID = '';
  }

  return (
    <main>
      <MobileNav
        user_id={params.user_id as string}
        CurrentPage={'userPage'}
        userteams={userteams}
      />
      <WebNavigation
        CurrentPage={userPage}
        user_id={params.user_id as string}
      />
      <section className="laptop:ml-[225px] bg-[#F6F8FA] min-h-screen h-full">
        <WebHeader userId={params.user_id as string} CurrentPage={userPage} />
        {userteams.length > 0 ? (
          <div className="flex flex-col items-center h-full">
            <UserDashBoard
              userID={params.user_id as string}
              teams={userteams}
              teamID={teamID}
            />
          </div>
        ) : (
          <div className="h-[80vh] w-full flex justify-center items-center flex-col">
            <i>No team found</i>
            <i>Join a team to the left to get started</i>
          </div>
        )}
      </section>
    </main>
  );
};

export default withPageAuthRequired(UserDashboard, {
  returnTo: (obj: AppRouterPageRouteOpts) => {
    if (obj && obj.params && 'user_id' in obj.params) {
      const { user_id } = obj.params;
      return `${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/${user_id}`;
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/`;
  },
});
