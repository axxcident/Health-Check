import React from 'react';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
}) => {
  return (
    <label htmlFor={name} className="mx-4 p-2 flex items-center">
      {label}
      <input
        name={name}
        id={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 ml-2"
      />
    </label>
  );
};

export default Checkbox;
