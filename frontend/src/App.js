import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import RegisterContainer from 'containers/Auth/RegisterContainer';
import LoginContainer from 'containers/Auth/LoginContainer';
import VerifyEmailContainer from 'containers/Auth/VerifyEmailContainer';
import DashboardContainer from 'containers/Dashboard/DashboardContainer';
import AppProvider from 'store/store';
import { login } from 'constants/routeLinks';
import RootComponents from 'modules/Shared/RootComponents';
import PrivateRoute from 'modules/Shared/PrivateRoute';
import { getUserDetails, setUser } from 'slices/authSlice';

function AppWrapper() {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('chat-token');
    if (token) {
      dispatch(getUserDetails());
    } else {
      dispatch(setUser({}));
    }
  }, []);

  if (user === null) return <>Loading...</>;

  return (
    <>
      <RootComponents />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard">
            <Route
              index
              element={
                <PrivateRoute>
                  <DashboardContainer />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path=":contactId"
              element={
                <PrivateRoute>
                  <DashboardContainer />
                </PrivateRoute>
              }
            />
          </Route>
          <Route exact path="/register" element={<RegisterContainer />} />
          <Route exact path="/login" element={<LoginContainer />} />
          <Route exact path="/verify_email/:id/:token" element={<VerifyEmailContainer />} />
          <Route path="/" element={<Navigate replace to={login} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}

export default App;
