'use client';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { createNewSession } from '../lib/actions';
import BTN from './btn';
import TeamFetch from './team-fetch';
import ModalCloseBTN from './modal-close-btn';

type ModalProps = {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  team_id?: string;
  modalClassname?: string;
};

const NewSessionModal = ({
  toggleModal,
  team_id,
  modalClassname,
}: ModalProps) => {
  const initialState = {
    message: 'Create New Session',
  };

  const [state, formAction] = useFormState(createNewSession, initialState);

  const overlayClick = () => {
    console.log('overlay clicked');
    toggleModal(false);
  };

  useEffect(() => {
    if (state.message === 'New session created') {
      toggleModal(false);
    }
  }, [state.message, toggleModal]);

  return (
    <>
      <section
        onClick={overlayClick}
        className="fixed z-40 cursor-default right-0 top-0 min-w-full w-screen min-h-screen mr-0 h-screen bg-black opacity-50"
      ></section>
      <div
        className={`fixed z-50 cursor-default left-[35vw] top-[25%] h-1/5 max-h-[500px] w-[40vw] max-w-[450px] bg-white rounded-xl ${modalClassname}`}
      >
        <header className="bg-[#FEE0DF] flex p-4 justify-between items-center rounded-tl-lg rounded-tr-lg">
          <h3 className="font-medium text-4xl text-[#393e46]">
            Create new session
          </h3>
          <ModalCloseBTN setModal={toggleModal} />
        </header>
        <form
          action={formAction}
          className="w-full h-2/4 flex justify-center items-center p-4"
        >
          <input type="hidden" name="team_id" id="team_id" value={team_id} />
          <p>
            New session for team: <TeamFetch teamID={team_id} />
          </p>
          <BTN
            text={`${state.message} `}
            // text="Create New Session"
            mode="secondary"
            type="submit"
            className="w-[300px] font-semibold"
          />
        </form>
      </div>
    </>
  );
};

export default NewSessionModal;
