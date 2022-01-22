import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'slices/authSlice';
import contactsReducer from 'slices/contactsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer
  }
});

export default function AppProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
