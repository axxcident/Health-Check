'use client';
import { useTeamFetch } from '../lib/hooks';

type TeamFetchProp = {
  teamID?: string;
};

const TeamFetch = ({ teamID }: TeamFetchProp) => {
  const [team, loading] = useTeamFetch({ teamID });

  return <>{loading ? 'Loading...' : team?.team_name || 'No Team'}</>;
};

export default TeamFetch;
