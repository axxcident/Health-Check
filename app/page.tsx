import React from 'react';
import Image from 'next/image';
import BTN from './_components/btn';
import { auth0Login } from './lib/actions';

export default async function Home() {
  let authorizer = await auth0Login();

  return (
    <main className="flex bg-[#033E5E] laptop:bg-white justify-between overflow-x-hidden h-screen">
      <section className="flex flex-col mt-4 laptop:min-w-[490px] w-full laptop:max-w-2xl">
        <div className="hidden laptop:flex justify-between pl-12 pr-12 items-center">
          <div className="overflow-hidden w-[188px] h-[123px] rounded-2xl">
            <Image
              src="/health-check-in.png"
              alt="health check in logo"
              width={1024}
              height={1024}
              className="object-cover w-full h-full transform scale-[1.75]"
              priority={true}
            />
          </div>
        </div>
        <div className="laptop:hidden w-full h-full">
          <div className="absolute w-full h-20 flex flex-col justify-start items-center">
            <h1 className="text-center text-5xl font-bold capitalize text-[#FFFFFF] p-8 z-10">
              health check in app
            </h1>
          </div>
          <div className="relative h-full w-full flex flex-col justify-end">
            <Image
              src="/HCI_logo.png"
              alt="health check in logo"
              width={1024}
              height={1024}
              className="w-full z-10 absolute top-0 p-12 sm:p-24 sm:max-w-[566px] mt-36 sm:mt-24 max-w-[300px]"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              priority={true}
            />
            <Image
              src="/BG_gradient.svg"
              alt="health check in logo"
              width={1024}
              height={1024}
              className="w-full h-full left-0 -top-16 absolute z-0"
              priority={true}
            />
            {authorizer == undefined ? (
              <>
                <div
                  className="absolute bottom-16 sm:bottom-20 w-full"
                  style={{
                    left: '10%',
                    transform: 'translateX(-10%)',
                  }}
                >
                  <BTN
                    text={`Get started`}
                    href="/api/auth/login"
                    mode="secondary"
                    className="w-[70%] mx-auto"
                    type="submit"
                  />
                </div>
              </>
            ) : (
              <>
                <BTN
                  text={`${authorizer.message === 'Invalid Bontouch email' ? 'Try again' : `${authorizer.message}`}`}
                  href="/api/auth/login"
                  mode="secondary"
                  className="w-full"
                  type="submit"
                />
                <div className="flex items-center p-1">
                  <Image
                    className=""
                    src="/error-icon.svg"
                    alt="log in error symbol"
                    height={24}
                    width={24}
                    style={{ width: 24, height: 24 }}
                  />
                  <p className="flex font-medium text-md ml-1 text-[#F05237]">
                    {authorizer.message}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden mt-[85px] pl-12 pr-12 laptop:flex h-[38vh] flex-col justify-around">
          <h1 className="text-balance text-5xl font-bold">Welcome!</h1>
          <p className="text-md font-light">
            Sign in to keep track on your work healthiness and that of your
            team&apos;s. Create sessions and join your team on Bontouch
          </p>
          {authorizer == undefined ? (
            <>
              <BTN
                text={`Get started`}
                href="/api/auth/login"
                mode="primary"
                className="w-full"
                type="submit"
              />
            </>
          ) : (
            <>
              <BTN
                text={`${authorizer.message === 'Invalid Bontouch email' ? 'Try again' : `${authorizer.message}`}`}
                href="/api/auth/login"
                mode="primary"
                className="w-full"
                type="submit"
              />
              <div className="flex items-center p-1">
                <Image
                  className=""
                  src="/error-icon.svg"
                  alt="log in error symbol"
                  height={24}
                  width={24}
                  style={{ width: 24, height: 24 }}
                />
                <p className="flex font-medium text-md ml-1 text-[#F05237]">
                  {authorizer.message}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="hidden laptop:flex laptop:flex-shrink-0 overflow-hidden">
        <div className="h-screen">
          <Image
            src="/homepage.jpeg"
            alt="landing site homepage image"
            width={1024}
            height={1024}
            className="object-cover w-full h-full"
            priority={true}
          />
        </div>
      </section>
    </main>
  );
}
