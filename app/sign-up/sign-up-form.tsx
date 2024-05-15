'use client';
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { addNewUser } from './actions';
import BTN from '../_components/btn';
import CustomInput from '../_components/custom-input';

const SignUpForm = () => {
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const initialState = {
    message: '',
  };

  const [state, formAction] = useFormState(addNewUser, initialState);

  useEffect(() => {
    if (
      state.message === 'Invalid email' ||
      state.message === 'email already exist'
    ) {
      setError(state.message);
    }
  }, [state.message]);

  return (
    <form action={formAction} className="pl-12 pr-12 flex flex-col relative">
      <CustomInput
        label="EMAIL"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jane.doe@bontouch.com"
        error={error}
        setError={setError}
        className="w-[100%]"
      />
      <div className="grid grid-cols-3 gap-4">
        <CustomInput
          label="FIRSTNAME"
          name="firstname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Jane"
          error={error}
          setError={setError}
          wrapperClassName="flex flex-col col-span-1"
        />
        <CustomInput
          label="LASTNAME"
          name="lastname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          error={error}
          setError={setError}
          wrapperClassName="flex flex-col col-span-2"
        />
      </div>
      <CustomInput
        label="PASSWORD"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        error={error}
        setError={setError}
        className="w-[100%]"
      />
      <BTN
        text={'Sign Up'}
        mode="primary"
        className="w-full mt-2"
        type="submit"
      />
    </form>
  );
};

export default SignUpForm;
