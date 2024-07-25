import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/context";
import ScrollableChats from "./scrollableChats";
import Sidebar from "./sidebar";

const SingleChat = () => {
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState([]);
  const url = import.meta.env.VITE_SERVER;
  const { selectedChat, token } = useAuthContext();

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(handleFocus, 0);
  };

  const fetchMessages = async () => {
    try {
      await axios
        .get(`${url}/message/${selectedChat._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          setFetchedMessage(data.data);
        });

      // console.log("User joined" + selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && message) {
      try {
        await axios
          .post(
            `${url}/message`,
            {
              message: message,
              chatId: selectedChat._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            fetchMessages();
            setMessage("");
            console.log(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    handleFocus();
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <div className="h-full w-full flex flex-col bg-black">
      {selectedChat ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex-shrink-0 py-5 px-2 text-start">
            {selectedChat?.name}
          </div>
          <div className="flex-grow p-2 overflow-auto bg-neutral-950">
            <ScrollableChats messages={fetchedMessage} />
          </div>
          <div className="flex-shrink-0 w-full bg-black p-2">
            <div className="flex items-center gap-x-2">
              <div className="flex-grow">
                <input
                  ref={inputRef}
                  className="w-full h-full focus:outline-none"
                  onChange={handleChange}
                  value={message}
                  onBlur={handleBlur}
                  onKeyDown={sendMessage}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SingleChat;
