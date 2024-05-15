import React, { useEffect } from 'react';
import { createNewTeam } from '../lib/actions';
import { useFormState } from 'react-dom';
import BTN from './btn';
import CustomInput from './custom-input';
import ModalCloseBTN from './modal-close-btn';

type ModalProps = {
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  user_id?: string;
  className?: string;
  createFormClassname?: string;
  wrapperClassName?: string;
  createInputClassname?: string;
  createBTNClassname?: string;
};

const CreateTeamModal: React.FC<ModalProps> = ({
  toggleModal,
  user_id,
  className,
  createFormClassname,
  wrapperClassName,
  createInputClassname,
  createBTNClassname,
}) => {
  const [teamName, setTeamName] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const initialState = {
    message: 'Create Team',
  };

  const [state, formAction] = useFormState(createNewTeam, initialState);

  const overlayClick = () => {
    console.log('overlay clicked');
    toggleModal(false);
  };

  useEffect(() => {
    if (state.message === 'New team created') {
      toggleModal(false);
    }
  }, [state.message, toggleModal]);

  return (
    <>
      <section
        onClick={overlayClick}
        className="absolute z-40 cursor-default left-0 top-0 w-screen h-screen bg-black opacity-50"
      ></section>
      <div
        className={`absolute z-50 cursor-default left-[35vw] top-[25%] h-60 max-h-[500px] w-[55vw] max-w-[550px] bg-white rounded-xl ${className}`}
      >
        <header className="bg-[#FEE0DF] flex p-4 justify-between items-center rounded-tl-lg rounded-tr-lg">
          <h3 className="font-medium text-4xl text-[#393e46]">Create Team</h3>
          <ModalCloseBTN setModal={toggleModal} />
        </header>
        <form
          action={formAction}
          className={`flex items-center justify-center h-4/6 p-4 ${createFormClassname}`}
        >
          <input type="hidden" name="user_id" value={user_id} />
          <CustomInput
            label="Team Name"
            error={error}
            setError={setError}
            placeholder="Team Name"
            name="team_name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            wrapperClassName={`pb-4 ml-4 ${wrapperClassName}`}
            className={`h-[56px] w-full ${createInputClassname}`}
          />
          <BTN
            text={`${state.message}`}
            // text={'Create Team'}
            mode="primary"
            className={`w-4/5 m-4 max-w-[200px] ${createBTNClassname}`}
            type="submit"
          />
        </form>
      </div>
    </>
  );
};

export default CreateTeamModal;
