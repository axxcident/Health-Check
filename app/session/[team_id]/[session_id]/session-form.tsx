import React from 'react';
import Form from './form';
import WebHeader from '@/app/_components/web-header';

type SessionIdProp = {
  sessionId: string;
  teamID: string;
  user_id: string;
};

const SessionForm = async ({ sessionId, teamID, user_id }: SessionIdProp) => {
  return (
    <>
      <section className="laptop:ml-[225px] xxsm:mt-10 xsm:mt-0 bg-[#F6F8FA] min-h-screen">
        <WebHeader teamID={teamID} CurrentPage={'teampage'} />
        <article className="h-[90vh] flex flex-col items-center justify-center w-full">
          <div className="w-full h-full">
            <Form
              sessionId={sessionId}
              userID={user_id as string}
              teamID={teamID as string}
            />
          </div>
        </article>
      </section>
    </>
  );
};

export default SessionForm;
