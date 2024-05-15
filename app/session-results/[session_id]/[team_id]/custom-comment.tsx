'use client';
import React from 'react';
import UserNameFetch from '../../../_components/user-name-fetch';
import { FaRegFaceSmileBeam } from 'react-icons/fa6';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { FaRegFaceMeh } from 'react-icons/fa6';
import { FaRegFaceGrin } from 'react-icons/fa6';
// import { FaRegFaceDizzy } from "react-icons/fa6";
import { FaRegFaceMehBlank } from 'react-icons/fa6';
import { FaRegFaceSurprise } from 'react-icons/fa6';

type SessionCheckinEntry = {
  key: string;
  user_id: string;
  happiness: number;
  productivity: number;
  stress: number;
  komment: string;
};

const CustomComment = ({
  key,
  user_id,
  happiness,
  productivity,
  stress,
  komment,
}: SessionCheckinEntry) => {
  const getEmoij = (value: number) => {
    switch (value) {
      case 1:
        return <FaRegFaceMehBlank />;
      case 2:
        return <FaRegFaceMeh />;
      case 3:
        return <FaRegFaceSmile />;
      case 4:
        return <FaRegFaceGrin />;
      case 5:
        return <FaRegFaceSmileBeam />;
      default:
        return '';
    }
  };

  const getEmoijReverse = (value: number) => {
    switch (value) {
      case 1:
        return <FaRegFaceSmileBeam />;
      case 2:
        return <FaRegFaceGrin />;
      case 3:
        return <FaRegFaceSmile />;
      case 4:
        return <FaRegFaceMeh />;
      case 5:
        return <FaRegFaceSurprise />;
      // return <FaRegFaceMehBlank />;
      default:
        return '';
    }
  };

  const getColorClass = (value: number) => {
    if (value === 1) return 'text-[#E55223]';
    else if (value === 2) return 'text-[#E5D223]';
    else if (value === 3) return 'text-[#E5AF23]';
    else if (value === 4) return 'text-[#A1E87F]';
    else if (value === 5) return 'text-[#449C1A]';
    else return '';
  };

  const getColorClassStress = (value: number) => {
    if (value === 1) return 'text-[#449C1A]';
    else if (value === 2) return 'text-[#A1E87F]';
    else if (value === 3) return 'text-[#E5AF23]';
    else if (value === 4) return 'text-[#E5D223]';
    else if (value === 5) return 'text-[#E55223]';
    else return '';
  };

  return (
    <div
      key={`${key}`}
      className="flex justify-between p-4 bg-white mb-2 rounded-md shadow-md hover:shadow-lg focus:shadow-md focus:outline-none"
    >
      <div className="flex items-center">
        <p className="p-1 mr-1 text-nowrap">
          <UserNameFetch userID={user_id} />:
        </p>
        <p className="italic p-2"> &quot;{komment}&quot;</p>
      </div>
      <div className="flex laptop:flex-row flex-col items-center text-xl">
        <p className="ml-2 mr-2 mt-1 mb-1 p-1">
          H:{happiness}
          <span className={`${getColorClass(happiness)} font-semibold`}>
            {getEmoij(happiness)}
          </span>
        </p>
        <p className="mr-2 mt-1 mb-1 p-1">
          P:{productivity}
          <span className={`${getColorClass(productivity)} font-semibold`}>
            {getEmoij(productivity)}
          </span>
        </p>
        <p className="mr-2 mt-1 mb-1 p-1">
          S:{stress}
          <span className={`${getColorClassStress(stress)} font-semibold`}>
            {getEmoijReverse(stress)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomComment;
