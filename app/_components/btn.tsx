'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';
import { useFormStatus } from 'react-dom';

type textProps = {
  text: string;
  className?: string;
  mode?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  href?: string;
  toggleModal?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
  value?: string;
  name?: string;
  id?: string;
};

const BTN = ({
  text,
  className = 'w-[80%] mb-2',
  mode = 'primary',
  type = 'button',
  href,
  toggleModal,
  value = '',
  name,
  id,
}: textProps) => {
  const router = useRouter();
  let buttonMode;
  if (mode === 'primary') {
    buttonMode =
      'bg-[#393E46] text-[#FFFFFF] hover:bg-[#4A505B] hover:text-[#FFFFFF] active:bg-[#24272D] active:text-[#FFFFFF]';
  } else if (mode === 'secondary') {
    buttonMode =
      'bg-[#FFFFFF] text-[#393E46] border-[1.4px] border-[#BFC1C6] border-solid border-opacity-50 hover:bg-[#F6F8FA] hover:text-[#393E46] active:bg-[#E8E7E7] active:text-[#393E46]';
  } else if (mode === 'disabled') {
    buttonMode = 'bg-[#E8E7E7] text-[#B9B8B6] cursor-not-allowed';
  } else {
    buttonMode = '';
  }

  const [btnloading, setBtnLoading] = React.useState<boolean>(false);
  const { pending } = useFormStatus();

  if (btnloading && href) {
    setTimeout(() => {
      router.push(href);
    }, 4000);
  }

  if (href) {
    return (
      <>
        {btnloading ? (
          <button
            type={type}
            disabled={btnloading}
            className={`capitalize p-3 h-[56px] ${buttonMode} font-medium text-[16px] rounded-lg ${className} flex items-center justify-center`}
          >
            <Image
              src="/loading_circle.svg"
              alt="loading icon"
              height={30}
              width={30}
              style={{ width: 30, height: 30 }}
              className="animate-spin text-center w-[24px] h-[24px]"
            />
          </button>
        ) : (
          <button
            type={type}
            disabled={btnloading}
            className={`capitalize p-4 ${buttonMode} font-medium text-[16px] rounded-lg ${className} flex items-center justify-center`}
            onClick={() => setBtnLoading(true)}
          >
            <Link href={href}>{text}</Link>
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {btnloading && pending ? (
        <button
          type={type}
          disabled={pending}
          className={`capitalize p-3 h-[56px] ${buttonMode} font-medium text-[16px] rounded-lg ${className} flex items-center justify-center`}
          value={value}
          name={name}
          id={id}
        >
          <Image
            src="/loading_circle.svg"
            alt="loading icon"
            height={30}
            width={30}
            style={{ width: 30, height: 30 }}
            className="animate-spin text-center w-[24px] h-[24px]"
          />
        </button>
      ) : (
        <button
          value={value}
          name={name}
          id={id}
          type={type}
          disabled={pending}
          className={`capitalize p-4 ${buttonMode} font-medium text-[16px] rounded-lg ${className} flex items-center justify-center`}
          onClick={() => {
            toggleModal && toggleModal(true);
            setBtnLoading(true);
          }}
        >
          <span>{text}</span>
        </button>
      )}
    </>
  );
};

export default BTN;
