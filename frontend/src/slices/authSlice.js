import { createSlice } from '@reduxjs/toolkit';
import _get from 'lodash.get';

import {
  register as registerApi,
  loginApi,
  resendVerifyEmailApi,
  verifyEmailApi,
  updateUserPassword,
  getUserDetailsApi
} from 'api/auth';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions;

export const register = (payload) => {
  return async () => {
    try {
      const resp = await registerApi(payload);
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const login = (payload) => {
  return async (dispatch) => {
    try {
      const resp = await loginApi(payload);
      const user = _get(resp, 'data.data.user', false);
      const token = _get(resp, 'data.data.token', false);
      if (user && token) {
        user.token = token;
        dispatch(setUser(user));
        localStorage.setItem('chat-token', token);
      } else {
        throw new Error('Login failed');
      }
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const resendVerifyEmail = (payload) => {
  return async () => {
    try {
      const resp = await resendVerifyEmailApi(payload);
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const verifyEmail = ({ id, token }) => {
  return async () => {
    try {
      const resp = await verifyEmailApi(id, token);
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const updatePassword = (payload) => {
  return async () => {
    try {
      const resp = await updateUserPassword(payload);
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const getUserDetails = () => {
  return async (dispatch) => {
    try {
      const resp = await getUserDetailsApi();
      const user = _get(resp, 'data.data', false);
      const token = localStorage.getItem('chat-token');
      if (user && token) {
        user.token = token;
        dispatch(setUser(user));
        localStorage.setItem('chat-token', token);
      } else {
        dispatch(setUser({}));
        throw new Error('Login failed');
      }
      return resp.data;
    } catch (e) {
      dispatch(setUser({}));
      return _get(e, 'response.data', {});
    }
  };
};

export default authSlice.reducer;
