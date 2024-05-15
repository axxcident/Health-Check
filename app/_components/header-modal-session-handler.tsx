'use client';
import React, { useState } from 'react';
import BTN from './btn';
import NewSessionModal from './new-session-modal';

type HeaderModalSessionHandlerProps = {
  team_id: string;
  BtnClassName?: string;
  modalClassname?: string;
};

const HeaderModalSessionHandler = ({
  team_id,
  BtnClassName,
  modalClassname,
}: HeaderModalSessionHandlerProps) => {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <BTN
        text={'new session'}
        mode="primary"
        toggleModal={setModal}
        className={`${BtnClassName}`}
      />
      {modal && (
        <NewSessionModal
          modalClassname={modalClassname}
          toggleModal={setModal}
          team_id={team_id}
        />
      )}
    </>
  );
};

export default HeaderModalSessionHandler;
