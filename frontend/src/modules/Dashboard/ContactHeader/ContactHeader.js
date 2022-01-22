import React from 'react';
import { Menu } from '@headlessui/react';
import _get from 'lodash/get';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import DropDown from 'helpers/DropDown/DropDown';

export default function ContactHeader({ onAddContact = () => {}, auth }) {
  const name = _get(auth, 'user.name');
  const email = _get(auth, 'user.email');

  return (
    <div className="flex p-1.5 bg-gray-200 border-b-2 border-gray-400 justify-between rounded-tl-md">
      <div className="flex items-center">
        <img
          src="/img/istockface.jpg"
          className="w-10 h-10 object-cover mr-3 rounded-full"
          alt=""
        />
        <div>{name ? name : email}</div>
      </div>
      <div>
        <DropDown
          renderTitle={() => {
            return (
              <div className="mr-2 mt-2">
                <FontAwesomeIcon icon={faEllipsisV} />
              </div>
            );
          }}
          renderList={() => {
            return (
              <>
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={onAddContact}
                        className={`${
                          active ? 'bg-gray-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faUserPlus} />
                        <div className="ml-3">Add contact</div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
