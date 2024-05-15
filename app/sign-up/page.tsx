import Image from 'next/image';
import React from 'react';
import SignUpForm from './sign-up-form';
import BTN from '../_components/btn';

const SignUp = () => {
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
        <div className="mt-[85px] pl-12 pr-12">
          <h1 className="text-balance text-5xl font-bold">Sign Up</h1>
          <p className="text-sm mt-[32px] mb-8 font-light">
            Sign up to keep track on your work healthiness and that of your
            team&apos;s. Join or create your own Bontouch team and create
            sessions to get started
          </p>
        </div>
        <SignUpForm />
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

export default SignUp;
