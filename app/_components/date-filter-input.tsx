import React from 'react';

type DateInputProps = {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const DateFilterInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  name,
}) => {
  return (
    <label className="mx-4 p-2 flex items-center">
      {label}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mx-2 p-1 border rounded"
        name={name}
        id={name}
      />
    </label>
  );
};

export default DateFilterInput;
