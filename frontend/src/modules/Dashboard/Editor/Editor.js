import React from 'react';

import Input from 'helpers/Input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import styles from './editor.module.scss';

export default function Editor({ onChange = () => {}, value, onSend = () => {} }) {
  const handelKeyup = (event) => {
    if (event.nativeEvent.keyCode === 13) {
      onSend();
      // event.preventDefault();
    }
  };

  return (
    <div className={`flex items-center bg-gray-200 ${styles.editor_container}`}>
      <div className="w-full pl-3">
        <Input
          onKeyUp={handelKeyup}
          value={value}
          onChange={({ target }) => onChange(target.value)}
          className="w-full"
          type="text"
          placeholder="Type a message"
        />
      </div>
      <div className="m-1.5 p-1.5 text-blue-700 rounded-2xl cursor-pointer">
        <FontAwesomeIcon onClick={onSend} icon={faPaperPlane} />
      </div>
    </div>
  );
}
