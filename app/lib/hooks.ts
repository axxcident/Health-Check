'use client';
import { useEffect, useState } from 'react';

type TeamFetchProp = {
  teamID?: string | null;
};
type Team = {
  team_id: string;
  team_name: string;
};

export function useTeamFetch({ teamID }: TeamFetchProp) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (teamID) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/team?Team_id=${teamID}`,
          );
          if (response.ok) {
            const data = await response.json();
            const modifiedTeam = {
              ...data.team,
              team_name: capitalizeFirstLetter(data.team.team_name),
            };
            setTeam(modifiedTeam);
          } else {
            console.error('Error fetching teams:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamID]);

  return [team, loading] as const;
}

type User = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string | null;
  password: string | null;
  lastname: string;
  picture: string;
};

type UserIdProp = {
  userId?: string | null;
};

//
export function useFetchUser({ userId }: UserIdProp) {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user?User_id=${userId}`,
          );
          if (response.ok) {
            const data = await response.json();
            let fetchedUser = data.individual_user;
            if (fetchedUser.first_name.includes('.')) {
              const NameParts = fetchedUser.first_name.split('.');
              fetchedUser = {
                ...fetchedUser,
                first_name: capitalizeFirstLetter(NameParts[0]),
              };
              if (NameParts[1] !== undefined) {
                fetchedUser = {
                  ...fetchedUser,
                  lastname: capitalizeFirstLetter(NameParts[1]),
                };
              }
            }
            if(fetchedUser.lastname) {
              fetchedUser = {
                ...fetchedUser,
                lastname: capitalizeFirstLetter(fetchedUser.lastname),
              };
            }
            const modifiedUser = {
              ...fetchedUser,
              first_name: capitalizeFirstLetter(fetchedUser.first_name),
            };
            setUser(modifiedUser);
          } else {
            console.error('Error fetching user:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return [user, userLoading] as const;
}
