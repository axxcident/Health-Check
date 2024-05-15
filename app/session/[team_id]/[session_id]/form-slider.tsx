'use client';
import { Slider } from '@/app/session/[team_id]/[session_id]/slider';
import React from 'react';

type FormSliderProps = {
  inputValue: number;
  setInputValue: React.Dispatch<React.SetStateAction<number>>;
  name: string;
};

const FormSlider = ({ inputValue, setInputValue, name }: FormSliderProps) => {
  return (
    <Slider
      id={name}
      name={name}
      defaultValue={[inputValue]}
      min={1}
      max={5}
      step={1}
      onValueChange={(e) => {
        const value: number = e[0];
        if (!isNaN(value) && value >= 1 && value <= 5) {
          setInputValue(value);
        }
      }}
    />
  );
};

export default FormSlider;
