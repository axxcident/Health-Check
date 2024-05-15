'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import BTN from './btn';

type OptionsProps = {
  user_id?: string;
};

const UserOptions = ({ user_id }: OptionsProps) => {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <div className="relative">
        <Image
          width={14}
          height={3}
          style={{ width: 18, height: 8 }}
          src="/options.svg"
          alt="user options"
          className="cursor-pointer w-[24px] h-[13px] mr-2 ml-1 mt-3 mb-3"
          onClick={() => setModal(!modal)}
        />
        {modal && (
          <div className="absolute -top-9 left-3 w-20 h-10 bg-slate-200 rounded-md">
            <BTN
              type="submit"
              text="Log out"
              mode="secondary"
              className=" w-24 h-12"
              href="/api/auth/logout"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UserOptions;
