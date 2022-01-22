import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import _get from 'lodash/get';

import Input from 'helpers/Input/Input';
import Button from 'helpers/Button/Button';
import { emailPattern } from 'constants/AppConstants';
import { register, dashboard } from 'constants/routeLinks';

export default function Login({ login, auth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const isLoggedIn = _get(auth, 'user.token', false);

  const onLogin = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!emailPattern.test(email)) {
      setError('Enter a valid email');
      return;
    }
    const response = await login({
      email,
      password
    });
    if (response.success) {
      navigate(dashboard);
    } else {
      toast.error('Error occured please try after sometime');
    }
  };

  const onChange = ({ target }) => {
    switch (target.name) {
      case 'email':
        setEmail(target.value);
        setError((state) => ({ ...state, email: target.value ? false : 'Email is required' }));
        break;
      case 'password':
        setPassword(target.value);
        setError((state) => ({
          ...state,
          password: target.value ? false : 'Password is required'
        }));
        break;
      default:
        break;
    }
  };

  if (isLoggedIn) return <Navigate replace to={dashboard} />;

  return (
    <div className="container m-auto mt-28">
      <div className="p-10 rounded-xl shadow-md m-auto flex w-6/12 flex-col items-center">
        <div className="font-medium mb-4 text-2xl">Login</div>
        <div className="mb-2 w-1/2">
          <label htmlFor="email" className="font-medium mb-3 text-gray-600">
            Email
          </label>
          <Input
            type="email"
            name="email"
            className="w-full"
            onChange={onChange}
            value={email}
            placeholder="Email"
          />
          {error.email && <p className="text-red-600 mt-3">{error.email}</p>}
        </div>
        <div className="mb-2 w-1/2">
          <label htmlFor="password" className="font-medium mb-3 text-gray-600">
            Password
          </label>
          <Input
            type="password"
            className="w-full"
            name="password"
            onChange={onChange}
            value={password}
            placeholder="Password"
          />
          {error.password && <p className="text-red-600 mt-3">{error.password}</p>}
        </div>
        <Button onClick={() => onLogin()} className="w-1/2 mt-4">
          Login
        </Button>
        <div className="text-gray-400 mt-6">
          Are you new here?{' '}
          <Link to={register} className="underline text-pink-300 cursor-pointer">
            click here
          </Link>{' '}
          to register
        </div>
      </div>
    </div>
  );
}
