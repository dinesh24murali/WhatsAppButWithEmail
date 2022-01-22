import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import ContactHeader from 'modules/Dashboard/ContactHeader/ContactHeader';
import AddContact from 'modules/Dashboard/AddContact/AddContact';
import { dashboard } from 'constants/routeLinks';

import styles from './contact-list.module.scss';

export default function ContactList({ addContacts, contacts, auth, markAsRead }) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { contactId } = useParams();

  let contactList = [];
  if (Array.isArray(contacts)) contactList = contacts;

  useEffect(() => {
    if (contactList.length > 0) {
      const currentContact = contactList.find((item) => item.id === contactId);
      if (currentContact && currentContact.hasUnreadMessage) {
        markAsRead(currentContact.id);
      }
    }
  }, [contactList.length]);

  const handleModal = async (email) => {
    if (email) {
      const resp = await addContacts({ email });
      if (resp.success) {
        toast.success('Contact added successfully');
        setOpenModal(false);
      } else {
        toast.error(resp.message);
      }
    } else {
      setOpenModal(false);
    }
  };

  const onContactSelect = (item) => {
    if (item.hasUnreadMessage) {
      markAsRead(item.id);
    }
    navigate(`${dashboard}/${item.id}`);
  };

  return (
    <>
      <ContactHeader auth={auth} onAddContact={() => setOpenModal(true)} />
      {openModal && <AddContact open={openModal} onClose={handleModal} />}
      <div className={`w-full overflow-y-auto ${styles.contact_list}`}>
        {contactList.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => onContactSelect(item)}
              className={`cursor-pointer p-3 ${
                contactId === item.id ? 'bg-gray-300' : 'bg-white'
              } hover:bg-gray-300 flex flex-row w-full justify-between`}>
              <div className="flex flex-col">
                <div className="font-medium text-lg text-black">
                  {item.name ? item.name : item.email}
                </div>
                <div className="font-normal text-xs text-gray-400">{item.email}</div>
              </div>
              {item.hasUnreadMessage && (
                <div className="flex justify-center items-center">
                  <div className="bg-blue-500 rounded-full w-3 h-3"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
