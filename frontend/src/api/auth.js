import { makeRequest } from 'utils/request';

export const loginApi = (payload) => makeRequest('post', '/login', payload);

export const register = (payload) => makeRequest('post', '/register_user', payload);

export const resendVerifyEmailApi = (payload) =>
  makeRequest('post', '/resend_verify_email', payload);

export const updateUserPassword = (payload) => makeRequest('put', '/update_password', payload);

export const verifyEmailApi = (userId, token) => makeRequest('get', `/verify/${userId}/${token}`);

export const getUserDetailsApi = () => makeRequest('get', '/user');
