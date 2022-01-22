import React from 'react';
import { Navigate } from 'react-router-dom';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { login } from 'constants/routeLinks';

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = _get(user, 'token', false);

  return <>{isLoggedIn ? children : <Navigate replace to={login} />}</>;
}
