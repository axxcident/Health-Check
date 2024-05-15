'use client';
import React, { useState } from 'react';
import FormSlider from './form-slider';
import { addSessionData } from './actions';
import { useFormState } from 'react-dom';
import CustomTextarea from '@/app/_components/custom-textarea';

type SessionIdProp = {
  sessionId: string;
  userID: string;
  teamID: string;
};

const Form = ({ sessionId, userID, teamID }: SessionIdProp) => {
  const [happiness, setHappiness] = useState<number>(1);
  const [productivity, setProductivity] = useState<number>(1);
  const [stress, setStress] = useState<number>(1);
  const [comment, setComment] = useState<string>('');

  const initialState = {
    message: '',
  };

  const [state, formAction] = useFormState(addSessionData, initialState);

  if (sessionId === null || userID === null || teamID === null) {
    console.log('No data');
    console.log('sessionId:', sessionId);
    console.log('userID:', userID);
    console.log('teamID:', teamID);
    return <p>Some prop is missing</p>;
  }

  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center w-full h-full gap-4 p-4"
    >
      <input type="hidden" name="session_id" value={sessionId as string} />
      <input type="hidden" name="user_id" value={userID as string} />
      <input type="hidden" name="team_id" value={teamID as string} />
      <div className="laptop:w-[80%] w-full laptop:h-16 h-20 pt-4 laptop:pt-6 flex laptop:flex-row flex-col justify-around laptop:items-center p-6 bg-white rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none mb-12">
        <label
          htmlFor="happiness"
          className="text-black font-medium text-[20px] w-32 mb-3 laptop:mb-0"
        >
          Happiness: {happiness}
        </label>
        <FormSlider
          inputValue={happiness}
          setInputValue={setHappiness}
          name={'happiness'}
        />
      </div>
      <div className="laptop:w-[80%] w-full laptop:h-16 h-20 pt-4 laptop:pt-6 flex laptop:flex-row flex-col justify-around laptop:items-center p-6 bg-white rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none mb-12">
        <label
          htmlFor="productivity"
          className="text-black font-medium text-[20px] w-32 mb-3 laptop:mb-0"
        >
          Productivity: {productivity}
        </label>
        <FormSlider
          inputValue={productivity}
          setInputValue={setProductivity}
          name={'productivity'}
        />
      </div>
      <div className="laptop:w-[80%] w-full laptop:h-16 h-20 pt-4 laptop:pt-6 flex laptop:flex-row flex-col justify-around laptop:items-center p-6 bg-white rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none mb-12">
        <label
          htmlFor="stress"
          className="text-black font-medium text-[20px] w-32 mb-3 laptop:mb-0"
        >
          Stress: {stress}
        </label>
        <FormSlider
          inputValue={stress}
          setInputValue={setStress}
          name={'stress'}
        />
      </div>
      <div className="laptop:w-[60%] w-full flex flex-col">
        <CustomTextarea
          label="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={300}
        />
      </div>
      <button
        className="w-[338px] h-[48px] min-h-10 rounded-md bg-[#2C664F] text-[#FFFFFF] font-semibold text-base mt-6"
        type="submit"
      >
        Submit Check-in
      </button>
    </form>
  );
};

export default Form;
