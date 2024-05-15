'use client';
import React, { useState, useEffect } from 'react';

type UserNameProp = {
  userID?: string;
};

type User = {
  user_id: string;
  first_name: string;
  email: string;
  team_id: string | null;
  password: string | null;
  lastname: string;
  picture: string;
};

const UserNameFetch = ({ userID }: UserNameProp) => {
  const [user, setUser] = useState<User | null>(null);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/one-user?User_id=${userID}`,
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
          const modifiedUser = {
            ...fetchedUser,
            first_name: capitalizeFirstLetter(fetchedUser.first_name),
          };
          setUser(modifiedUser);
        } else {
          console.error('Error fetching user:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (userID) {
      fetchUser();
    }
  }, [userID]);

  return (
    <>
      {user && (
        <span className="capitalize">
          {user.first_name} {user.lastname}
        </span>
      )}
    </>
  );
};

export default UserNameFetch;
