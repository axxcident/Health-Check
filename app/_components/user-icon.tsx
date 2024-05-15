'use client';
import React from 'react';
import Image from 'next/image';
import UserNameFetch from './user-name-fetch';
import * as Tooltip from '@radix-ui/react-tooltip';

type userIconProps = {
  userID: string;
  firstName: string;
  lastName: string;
  className?: string;
  picture?: string;
};

const UserIcon = ({
  userID,
  className = 'w-[70px]',
  picture,
}: userIconProps) => {
  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={`!min-w-10 max-w-10 h-10 ${className} flex`}>
              <Image
                src={picture || '/userperson.svg'}
                alt="User profile route"
                width={40}
                height={40}
                className="w-full h-10 items-center justify-center rounded-full border-2 border-white flex hover:shadow-lg hover:border-gray-300 hover:border-opacity-50"
              />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
              sideOffset={5}
            >
              <UserNameFetch userID={userID} />
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </>
  );
};

export default UserIcon;
