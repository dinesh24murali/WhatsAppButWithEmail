import axios from 'axios';

import { baseUrl } from 'constants/AppConstants';

const APIRequest = axios.create();

APIRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

APIRequest.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('chat-token');
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const makeRequest = (method, url, data) => {
  try {
    return APIRequest({
      method,
      url: `${baseUrl}${url}`,
      data
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
