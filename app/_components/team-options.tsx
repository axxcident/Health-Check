'use client';
import { leaveTeam } from '../lib/actions';
import React, { useState } from 'react';
import Image from 'next/image';
import { useFormState } from 'react-dom';
import BTN from './btn';

type OptionsProps = {
  user_id: string;
  team_id: string;
  className?: string;
  modalClassName?: string;
};

const TeamOptions = ({
  user_id,
  team_id,
  className,
  modalClassName,
}: OptionsProps) => {
  const initialState = {
    message: '',
  };

  const [state, formAction] = useFormState(leaveTeam, initialState);
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <div
        className={`relative flex items-center justify-center w-12 h-12 p-2 mt-2 ml-2 border rounded-full ${className}`}
      >
        <Image
          width={14}
          height={3}
          style={{ width: 18, height: 8 }}
          src="/options.svg"
          alt="team options"
          className="w-full h-full cursor-pointer"
          onClick={() => setModal(!modal)}
        />
        {modal && (
          <form
            action={formAction}
            className={`absolute top-4 left-10 w-20 h-10 bg-slate-200
            rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none ${modalClassName}`}
          >
            <input type="hidden" value={user_id} name="user_id" id="user_id" />
            <input type="hidden" value={team_id} name="team_id" id="team_id" />
            <BTN
              type="submit"
              text="Leave Team"
              mode="secondary"
              className="h-12 w-24"
            />
          </form>
        )}
      </div>
    </>
  );
};

export default TeamOptions;
