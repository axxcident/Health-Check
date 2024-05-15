import React from 'react';
import Image from 'next/image';

type CustomInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  type?: React.HTMLInputTypeAttribute | string;
  name: React.HTMLInputTypeAttribute | string;
  className?: string;
  wrapperClassName?: string;
};

const CustomInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  setError,
  type = 'text',
  name,
  className,
  wrapperClassName,
}: CustomInputProps) => {
  const handleClearInput = () => {
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    setError('');
  };

  return (
    <div className={`relative ${wrapperClassName}`}>
      <label htmlFor={label} className="font-bold text-sm mb-2">
        {label}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-[6px] p-4 mb-4 mt-2 ${className} h-[44px]`}
        name={name}
      />
      {error && (
        <div className="absolute right-4 top-[59%] transform -translate-y-1/2 flex items-center">
          <Image
            className="cursor-pointer"
            src="/error-icon.svg"
            alt="log in error symbol"
            height={24}
            width={24}
            style={{ width: 24, height: 24 }}
            onClick={handleClearInput}
          />
          <p className="flex font-medium text-sm ml-1 text-[#F05237]">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomInput;
