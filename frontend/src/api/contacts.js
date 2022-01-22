import { makeRequest } from 'utils/request';

export const getUserContactsApi = () => makeRequest('get', '/user_contacts');

export const addContactsApi = (payload) => makeRequest('post', '/add_contact', payload);

export const getChatApi = (contactId, payload) =>
  makeRequest('post', `/get_chat/${contactId}`, payload);

export const markAsReadApi = (contactId) => makeRequest('put', `/mark_as_read/${contactId}`, {});

export const createOrUpdateFcmTokenApi = (payload) =>
  makeRequest('post', '/create_or_update_fcm_token', payload);
