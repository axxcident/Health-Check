import React from 'react';

type CustomTextareaProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength: number;
};

const CustomTextarea = ({
  label,
  value,
  onChange,
  maxLength,
}: CustomTextareaProps) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={label}
        className="text-[#4C5769] font-bold text-sm mb-2 capitalize"
      >
        {label}:
      </label>
      <textarea
        id={label}
        name={label}
        value={value}
        onChange={onChange}
        className="border-2 border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-[#4C5769] focus:border-transparent"
        maxLength={maxLength}
      ></textarea>
    </div>
  );
};

export default CustomTextarea;
