import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import ContactListContainer from 'containers/Dashboard/ContactListContainer';
import ChatContainer from 'containers/Dashboard/ChatContainer';
import { onMessageListener } from 'utils/firebase';
import SocketContainer from 'containers/Dashboard/SocketContainer';
import { messaging } from 'utils/firebase';

import styles from './ContactList/contact-list.module.scss';

const EmptyState = () => {
  return (
    <div className={`w-full overflow-y-auto h-full ${styles.contact_list}`}>
      <div className="flex items-center justify-center h-full flex-col">
        <div>Select a contact to start chatting!</div>
      </div>
    </div>
  );
};

export default function Dashboard({ getUserContacts, createOrUpdateFcmToken }) {
  const { contactId } = useParams();

  useEffect(() => {
    getUserContacts();
  }, []);

  useEffect(() => {
    messaging
      .getToken({
        vapidKey:
          'BPloOsVDrmhMGKWs6jpvEud8X4uVyy0ELyr2BMTO-F5C7MmfsM_UhWkBeZmpDtxQX7dM9BQez6hRVgWcMe9vW8o'
      })
      .then((resp) => {
        console.log({ token: resp });
        createOrUpdateFcmToken(resp);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  onMessageListener()
    .then((payload) => {
      toast.success(payload.notification.title);
      console.log(' FCM message ', payload);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <>
      <SocketContainer />
      <div className="container m-auto mt-8">
        <div className="w-full rounded-xl shadow-md m-auto flex flex-row">
          <div className="w-1/4 border-r border-gray-300">
            <ContactListContainer />
          </div>
          <div className="w-3/4">{contactId ? <ChatContainer /> : <EmptyState />}</div>
        </div>
      </div>
    </>
  );
}
