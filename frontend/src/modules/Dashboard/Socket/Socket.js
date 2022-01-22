/* eslint-disable no-undef */

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import _get from 'lodash/get';
import { useParams } from 'react-router-dom';

export default function Socket({
  auth,
  isSendMessage,
  setSingleMessage,
  markNewMessageForContact
}) {
  const [socketConnection, setSocketConnection] = useState(null);
  const { contactId } = useParams();

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_BASEURL;
    const socket = io(socketUrl, {
      query: { token: _get(auth, 'user.token') }
    });
    setSocketConnection(socket);
    socket.on('connect', () => {
      console.log(`connect - ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`disconnect - ${socket.id}`);
    });

    socket.on('client-message', (data) => {
      console.log(`client-message`, data);
      console.log(`contactId`, contactId);
      // const tt = contactId;
      // debugger;
      if (contactId === data.senderId) {
        setSingleMessage(data);
      } else {
        markNewMessageForContact(data);
      }
    });
  }, []);

  useEffect(() => {
    if (isSendMessage && socketConnection) {
      socketConnection.emit('message', isSendMessage);
    }
  }, [isSendMessage]);

  return <></>;
}
