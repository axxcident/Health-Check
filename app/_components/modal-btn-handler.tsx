'use client';
import React, { useState } from 'react';
import BTN from './btn';
import JoinTeamModal from './join-team-modal';
import CreateTeamModal from './create-team-modal';

type ModalBtnHandlerProps = {
  user_id: string;
  createTeamMode?: string;
  joinTeamMode?: string;
  createteamClassName?: string;
  jointeamClassName?: string;
  createFormClassname?: string;
  createWrapperClassName?: string;
  createInputClassname?: string;
  createBTNClassname?: string;
  joinTeamModalWrapper?: string;
};

const ModalBtnHandler = ({
  user_id,
  createTeamMode,
  joinTeamMode,
  createteamClassName,
  jointeamClassName,
  createFormClassname,
  createWrapperClassName,
  createInputClassname,
  createBTNClassname,
  joinTeamModalWrapper,
}: ModalBtnHandlerProps) => {
  const [joinTeamModal, setJoinTeamModal] = useState<boolean>(false);
  const [createTeamModal, setCreateTeamModal] = useState<boolean>(false);

  return (
    <>
      <BTN
        text={'create team'}
        mode={createTeamMode}
        toggleModal={setCreateTeamModal}
      />
      <BTN
        text={'join team'}
        mode={joinTeamMode}
        toggleModal={setJoinTeamModal}
      />
      {joinTeamModal && (
        <JoinTeamModal
          toggleModal={setJoinTeamModal}
          user_id={user_id}
          className={jointeamClassName}
          joinTeamModalWrapper={joinTeamModalWrapper}
        />
      )}
      {createTeamModal && (
        <CreateTeamModal
          toggleModal={setCreateTeamModal}
          user_id={user_id}
          className={createteamClassName}
          createFormClassname={createFormClassname}
          wrapperClassName={createWrapperClassName}
          createInputClassname={createInputClassname}
          createBTNClassname={createBTNClassname}
        />
      )}
    </>
  );
};

export default ModalBtnHandler;
