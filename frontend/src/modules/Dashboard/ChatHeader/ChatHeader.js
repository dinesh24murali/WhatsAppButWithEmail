import React from 'react';
import DropDown from 'helpers/DropDown/DropDown';
import { Menu } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export default function ChatHeader() {
  return (
    <div className="flex p-1.5 bg-gray-200 border-b-2 border-gray-400 justify-between rounded-tr-md">
      <div className="flex items-center">
        <img
          src="/img/istockface.jpg"
          className="w-10 h-10 object-cover mr-3 rounded-full"
          alt=""
        />
        <div>Sam</div>
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
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        Duplicate
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        Archive
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        Move
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                        Delete
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
