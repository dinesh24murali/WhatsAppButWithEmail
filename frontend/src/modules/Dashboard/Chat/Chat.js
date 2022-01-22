import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import _get from 'lodash.get';
import moment from 'moment';
// import InfiniteScroll from 'react-infinite-scroll-component';

import ChatHeader from 'modules/Dashboard/ChatHeader/ChatHeader';
import Editor from 'modules/Dashboard/Editor/Editor';
import styles from './chat.module.scss';
import { toast } from 'react-toastify';

const initialPage = 1;

export default function Chat({
  auth,
  enableScrollToBorrom,
  setEnableScrollToBorrom,
  onSendMessage,
  getMessages,
  messages: chatList
}) {
  const { contactId } = useParams();
  const chatContainerRef = useRef(false);
  const disablePaginationRef = useRef(false);
  const callInProgress = useRef();
  const distanceFromBottom = useRef(0);
  const { id } = auth.user;
  const [message, setMessage] = useState();
  // const [disablePagination, setDisablePagination] = useState(false);
  const [page, setPage] = useState(initialPage);

  const getAndSetMessages = async (pageNumber) => {
    if (!contactId || disablePaginationRef.current) return;
    if (callInProgress.current) return;
    callInProgress.current = true;
    const { data, isEndOfChat } = await getMessages({
      contactId,
      payload: {
        pageNo: pageNumber
      },
      isAppend: pageNumber === initialPage ? false : true
    });
    disablePaginationRef.current = isEndOfChat;
    // setDisablePagination(isEndOfChat);
    const isSuccess = _get(data, 'success', false);
    if (isSuccess) {
      setPage((state) => state + 1);
    } else {
      toast.error(data.message);
    }
    callInProgress.current = false;
  };

  useEffect(() => {
    if (chatList.length > 0 && enableScrollToBorrom) {
      const domNode = chatContainerRef.current;
      if (domNode) {
        domNode.scrollTop = domNode.scrollHeight;
      }
      setEnableScrollToBorrom(false);
    } else if (chatList.length > 0 && !enableScrollToBorrom) {
      const domNode = chatContainerRef.current;
      if (domNode) {
        domNode.scrollTop = domNode.scrollHeight - distanceFromBottom.current;
      }
    }
  }, [chatList, enableScrollToBorrom]);

  useEffect(() => {
    if (contactId) {
      disablePaginationRef.current = false;
      // setDisablePagination(false);
      getAndSetMessages(initialPage);
      setPage(initialPage);
    }
  }, [contactId]);

  const handleSend = () => {
    if (message && contactId) {
      onSendMessage({ message, contactId });
      setMessage('');
    }
  };

  const onScroll = (event) => {
    distanceFromBottom.current = event.target.scrollHeight - event.target.scrollTop;
    // console.log({
    //   // top: event.target.scrollTop,
    //   // height: event.target.scrollHeight,
    //   distanceFromBottom,
    // })

    if (event.target.scrollTop < 200) {
      getAndSetMessages(page);
    }
  };

  return (
    <>
      <ChatHeader />
      <div
        onScroll={onScroll}
        className={`w-full overflow-y-auto pt-3 ${styles.chat_container}`}
        ref={chatContainerRef}>
        {chatList.map((item, index) => {
          const isReply = item.senderId === id ? false : true;
          const time = moment(item.time).format('MMMM Do YYYY, h:mm:ss a');

          return (
            <div key={index} className={`flex mb-4 ml-3 ${isReply ? '' : 'justify-end mr-3'}`}>
              <div
                className={`p-3 bg-blue-300 ${
                  isReply ? 'rounded-b-md rounded-tr-md' : 'rounded-b-md rounded-tl-md'
                }`}>
                <div>{item.message}</div>
                <div className="text-sm">{time}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Editor onChange={(data) => setMessage(data)} onSend={handleSend} value={message} />
    </>
  );
}
