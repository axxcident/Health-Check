import React from 'react';
import Image from 'next/image';
import BTN from '@/app/_components/btn';

const SignupComplete = () => {
  return (
    <main className="flex bg-white justify-between overflow-x-hidden h-screen">
      <section className="flex flex-col mt-4 min-w-[490px]">
        <div className="flex justify-between pl-12 pr-12 items-center">
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
          <BTN
            text={'Log In'}
            mode="secondary"
            className="w-[110px] mr-0 ml-0"
            href="/"
          />
        </div>
        <div className="pl-12 pr-12 mt-56">
          <h1 className="text-balance text-5xl font-bold">Done!</h1>
          <p className="text-sm mt-[32px] mb-8 font-light">
            You have successfully signed up. You can now log in and start using
            Health Check In
          </p>
          <BTN
            text={'Log In'}
            mode="primary"
            href="/"
            className="w-full ml-0 mr-0"
          />
        </div>
      </section>
      <section className="flex-shrink-0 overflow-hidden">
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
};

export default SignupComplete;
