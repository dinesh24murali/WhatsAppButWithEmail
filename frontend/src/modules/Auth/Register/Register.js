import React, { useState, useRef } from 'react';
import _get from 'lodash.get';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';

import Input from 'helpers/Input/Input';
import Button from 'helpers/Button/Button';
import { emailPattern } from 'constants/AppConstants';
import { login, dashboard } from 'constants/routeLinks';

export default function Register({ register, resendVerifyEmail, auth }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  const sentToEmail = useRef();
  const isLoggedIn = _get(auth, 'user.token', false);

  const onRegister = async () => {
    if (!emailPattern) {
      setError('Email is required');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Enter a valid email');
      return;
    }
    const response = await register({
      email
    });
    if (response && response.success) {
      sentToEmail.current = email;
      setSuccessMessage(true);
    } else {
      const msg = _get(response, 'message');
      if (msg) {
        setError(msg);
      } else {
        setError('Error occured please try after sometime');
      }
    }
  };

  const onEmailChange = ({ target }) => {
    setEmail(target.value);
    setError(target.value ? false : 'Email is required');
    setSuccessMessage(false);
  };

  const onResend = () => {
    resendVerifyEmail({
      email
    }).then((res) => {
      if (res.success) toast.success('Email has been verified');
      else toast.error(res.message);
    });
  };

  if (isLoggedIn) return <Navigate replace to={dashboard} />;

  return (
    <div className="container m-auto mt-28">
      <div className="p-10 rounded-xl shadow-md m-auto flex w-6/12 flex-col items-center">
        <div className="font-medium mb-4 text-2xl">Create an account</div>
        <div className="mb-2 w-1/2">
          <label className="font-medium mb-3 text-gray-600">Email</label>
          <Input
            type="email"
            className="w-full"
            onChange={onEmailChange}
            value={email}
            placeholder="Email"
          />
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
        {!error && successMessage && (
          <>
            <div className="text-green-400">
              A verification email has been sent to{' '}
              <span className="text-pink-300">{sentToEmail.current}</span>
            </div>
            <div className="text-gray-600">
              Didn&apos;t receive verification email?{' '}
              <span onClick={() => onResend()} className="underline text-pink-300 cursor-pointer">
                click here
              </span>{' '}
              to resend
            </div>
          </>
        )}
        <Button onClick={() => onRegister()} className="w-1/2 mt-4">
          Register
        </Button>
        <div className="text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to={login} className="underline text-pink-300 cursor-pointer">
            click here
          </Link>{' '}
          to login
        </div>
      </div>
    </div>
  );
}
