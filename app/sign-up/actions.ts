'use server';

import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

export async function addNewUser(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const email = formData.get('email');
  const firstname = formData.get('firstname');
  const lastname = formData.get('lastname');
  const password = formData.get('password');

  const isValidEmail = /^[a-zA-Z0-9._-]+@bontouch\.com$/.test(email as string);
  if (!isValidEmail) {
    return { message: 'Invalid email' };
  }
  let userID: string = '';

  try {
    const user_id = v4();

    prevState = { message: 'trying to set state message' };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      {
        method: 'POST',
        body: JSON.stringify({
          user_id: user_id,
          first_name: firstname,
          email: email,
          password: password,
          lastName: lastname,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          // 'Set-Cookie': `email=${JSON.stringify(email)}; SameSite=none; Secure`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      prevState = { message: 'New user added' };
      userID = data.individual_user.user_id;
      return { message: 'New user added' };
    } else {
      const errorData = await response.json();
      prevState = { message: 'email already exist' };
      return { message: `email already exist` };
      // return { message: `${errorData.error}` };
    }
  } catch (e) {
    console.log('error: ', e);
    return { message: 'email already exist' };
  } finally {
    console.log('prevState.message in finally block: ', prevState.message);
    if (prevState.message === 'New user added') {
      redirect(`/sign-up/sign-up-complete`);
    }
  }
}
