'use client';
import React, { useCallback, useEffect } from 'react';
import BTN from './btn';
import { useFormState } from 'react-dom';
import { leaveTeam } from '../lib/actions';

type FormProps = {
  user_id: string;
  team_id: string;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTeams: () => Promise<void>;
};

const FormBTN = ({ team_id, user_id, toggleModal, fetchTeams }: FormProps) => {
  const initialState = {
    message: '',
  };
  const [state, formAction] = useFormState(leaveTeam, initialState);

  const fetchTeamsMemoized = useCallback(fetchTeams, []);

  useEffect(() => {
    if (state) {
    }
    fetchTeams();
  }, [fetchTeamsMemoized, state]);

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="team_id" value={team_id} />
        <input type="hidden" name="user_id" value={user_id} />
        <BTN
          text={'Leave'}
          mode="primary"
          type="submit"
          toggleModal={toggleModal}
          className="rounded-md p-2 mt-2 cursor-pointer relative"
        />
      </form>
    </>
  );
};

export default FormBTN;
