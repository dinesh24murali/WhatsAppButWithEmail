import { createSlice } from '@reduxjs/toolkit';
import _get from 'lodash.get';
import { toast } from 'react-toastify';

import {
  getUserContactsApi,
  addContactsApi,
  getChatApi,
  markAsReadApi,
  createOrUpdateFcmTokenApi
} from 'api/contacts';
import moment from 'moment';

export const contactsSlice = createSlice({
  name: 'auth',
  initialState: {
    contacts: [],
    isSendMessage: null,
    messages: [],
    enableScrollToBorrom: true
  },
  reducers: {
    setContacts: (state, action) => {
      if (Array.isArray(action.payload)) state.contacts = action.payload;
    },
    setIsSendMessage: (state, action) => {
      state.isSendMessage = action.payload;
    },
    setMessages: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.messages = action.payload;
      }
    },
    setEnableScrollToBorrom: (state, action) => {
      state.enableScrollToBorrom = action.payload ? true : false;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setContacts, setIsSendMessage, setMessages, setEnableScrollToBorrom } =
  contactsSlice.actions;

export const getUserContacts = () => {
  return async (dispatch) => {
    try {
      const resp = await getUserContactsApi();
      if (resp.data && Array.isArray(resp.data.data)) {
        dispatch(setContacts(resp.data.data));
      }
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const addContacts = (payload) => {
  return async (dispatch) => {
    try {
      const resp = await addContactsApi(payload);
      dispatch(getUserContacts());
      return resp.data;
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const setSingleMessage = (payload) => {
  return async (dispatch, getState) => {
    try {
      let tempMessages = [payload];
      const currentState = getState();
      const messages = _get(currentState, 'contacts.messages', []);
      tempMessages = messages.concat(tempMessages);
      dispatch(setMessages(tempMessages));
      dispatch(setEnableScrollToBorrom(true));
    } catch (e) {
      console.log(e);
    }
  };
};

export const onSendMessage = (payload) => {
  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      const user = _get(currentState, 'auth.user', {});

      const { message, contactId } = payload;
      let chatId;
      if (user.id > contactId) {
        chatId = `${user.id}-${contactId}`;
      } else {
        chatId = `${contactId}-${user.id}`;
      }
      const currentUtcTime = moment.utc().format();
      const data = {
        senderId: user.id,
        message: message,
        receiverId: contactId,
        chatId,
        time: currentUtcTime,
        userId: user.id
      };
      dispatch(setIsSendMessage(payload));
      dispatch(setSingleMessage(data));
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const getMessages = ({ payload, contactId, isAppend }) => {
  return async (dispatch, getState) => {
    try {
      const data = await getChatApi(contactId, payload);
      let tempMessages = _get(data, 'data.data', []);
      if (isAppend) {
        const currentState = getState();
        const messages = _get(currentState, 'contacts.messages', []);
        tempMessages = tempMessages.concat(messages);
      }
      dispatch(setMessages(tempMessages));
      return {
        isEndOfChat: _get(data, 'data.data', []).length === 0 ? true : false,
        data: _get(data, 'data')
      };
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const markNewMessageForContact = (payload) => {
  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      const contacts = _get(currentState, 'contacts.contacts', []);
      const currentContactIndex = contacts.findIndex((item) => item.id === payload.senderId);
      if (currentContactIndex < 0) {
        return;
      }
      const tempContacts = JSON.parse(JSON.stringify(contacts));
      tempContacts[currentContactIndex].hasUnreadMessage = true;
      dispatch(setContacts(tempContacts));
    } catch (e) {
      console.log(e);
    }
  };
};

export const markAsRead = (contactId) => {
  return async (dispatch, getState) => {
    try {
      const data = await markAsReadApi(contactId);
      const isSuccess = _get(data, 'data.success');
      if (isSuccess) {
        const currentState = getState();
        const contacts = _get(currentState, 'contacts.contacts', []);
        const currentContactIndex = contacts.findIndex((item) => item.id === contactId);
        if (currentContactIndex < 0) {
          return;
        }
        const tempContacts = JSON.parse(JSON.stringify(contacts));
        tempContacts[currentContactIndex].hasUnreadMessage = false;
        dispatch(setContacts(tempContacts));
        return _get(data, 'data');
      }
    } catch (e) {
      return _get(e, 'response.data', {});
    }
  };
};

export const createOrUpdateFcmToken = (token) => {
  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      const user = _get(currentState, 'auth.user', {});
      const payload = {
        userId: user.id,
        token
      };
      const data = await createOrUpdateFcmTokenApi(payload);
      const isSuccess = _get(data, 'data.success');
      if (!isSuccess) {
        toast.error('Failed to register FCM token');
      }
    } catch (e) {
      toast.error('Failed to register FCM token');
      return _get(e, 'response.data', {});
    }
  };
};

export default contactsSlice.reducer;
