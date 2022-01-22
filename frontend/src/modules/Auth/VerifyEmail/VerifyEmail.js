import React, { useEffect, useState } from 'react';
import _get from 'lodash.get';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { login, dashboard } from 'constants/routeLinks';
import ResetpasswordForm from 'modules/Auth/VerifyEmail/ResetpasswordForm';
import Button from 'helpers/Button/Button';

export default function VerifyEmail({ verifyEmail, updatePassword, auth }) {
  const [status, setStatus] = useState(true);
  const [passwordForm, setPasswordForm] = useState({});
  const [error, setError] = useState({});

  const { id, token } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = _get(auth, 'user.token', false);

  useEffect(() => {
    verifyEmail({
      id,
      token
    })
      .then((response) => {
        if (response && response.success) {
          setStatus(true);
          toast.success('Email has been verified');
        } else {
          setStatus(false);
        }
      })
      .catch(() => {});
  }, []);

  const onChange = (event) => {
    const { name, value } = event;
    setPasswordForm((state) => ({ ...state, [name]: value }));
    setError((state) => ({ ...state, [name]: value ? false : `${name} is required` }));
  };

  const onSetPassword = () => {
    if (!passwordForm.password) {
      setError((state) => ({ ...state, password: 'password is required' }));
      return;
    }
    if (!passwordForm.confirmPassword) {
      setError((state) => ({ ...state, confirmPassword: 'Confirm password is required' }));
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError((state) => ({ ...state, confirmPassword: 'Passwords do not match' }));
      return;
    }
    updatePassword({
      id,
      password: passwordForm.password
    }).then((res) => {
      if (res && res.success) {
        toast.success('Password has been created');
        navigate(login);
      }
    });
  };

  if (isLoggedIn) return <Navigate replace to={dashboard} />;

  return (
    <div className="container m-auto mt-28">
      <div className="p-10 rounded-xl shadow-md m-auto flex w-6/12 flex-col items-center">
        {status === null && <p>Verifying your email....</p>}
        {status === true && (
          <>
            <div className="font-medium mb-1 text-2xl">Set your Password</div>
            <div className="mb-4 font-normal text-xs">Set your password and confirm it</div>
            <ResetpasswordForm value={passwordForm} onChange={onChange} error={error} />
            <Button onClick={() => onSetPassword()} className="w-1/2 mt-4">
              Submit
            </Button>
          </>
        )}
        {status === false && <p>Something went wrong</p>}
      </div>
    </div>
  );
}
