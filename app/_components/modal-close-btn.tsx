import React from 'react';

type ModalCloseBTNProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

const ModalCloseBTN = ({ setModal, className }: ModalCloseBTNProps) => {
  return (
    <div
      onClick={() => setModal(false)}
      className={`cursor-pointer rounded-full border border-black border-opacity-20 ${className}`}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L4 12"
          stroke="#676A70"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 4L12 12"
          stroke="#676A70"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ModalCloseBTN;
