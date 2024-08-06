import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/context";
import ScrollableChats from "./scrollableChats";
import { GoDotFill } from "react-icons/go";
import { useSocket } from "../context/socket";

const SingleChat = () => {
  const inputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [fetchedMessage, setFetchedMessage] = useState([]);
  const [fetchedUser, setFetchedUser] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const url = import.meta.env.VITE_SERVER;
  const { selectedChat, token } = useAuthContext();
  const [typingUser, setTypingUser] = useState("");
  const [typingTimer, setTypingTimer] = useState(null);

  const { user } = useAuthContext();
  const { socket, onlineUser, isConnected } = useSocket();

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    setTimeout(handleFocus, 0);
  };

  const fetchUser = async () => {
    if (!selectedChat) return;
    try {
      const response = await axios.get(`${url}/auth/user/${selectedChat._id}`);
      const { data } = response;
      if (data) {
        setFetchedUser((prev) => ({
          ...prev,
          online: data.online,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      await axios
        .get(`${url}/message/${selectedChat._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFetchedMessage(response.data);
        });
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
            socket.current.emit("new-message", user.id);
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

    clearTimeout(typingTimer);
    if (!isTyping) {
      socket.current.emit("typing", selectedChat._id, user.id);
    }

    const newTimer = setTimeout(() => {
      socket.current.emit("stop-typing", selectedChat._id);
    }, 1000);

    setTypingTimer(newTimer);
  };

  useEffect(() => {
    handleFocus();
    if (selectedChat) {
      setFetchedUser(selectedChat);
      fetchMessages();
      fetchUser();
      socket.current.emit("join-chat", selectedChat._id);
    }

    return () => socket.current.emit("leave-chat", selectedChat._id);
  }, [selectedChat]);

  useEffect(() => {
    socket.current.on("typing", (userId) => {
      setIsTyping(true);
      setTypingUser(userId);
    });
    socket.current.on("stop-typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    socket.current.on("new-message", () => fetchMessages());

    return () => {
      socket.current.off("typing");
      socket.current.off("stop-typing");
    };
  }, [selectedChat]);

  return (
    <div className="h-full w-full flex flex-col bg-black">
      {fetchedUser ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex-shrink-0 py-5 px-2 text-start">
            {fetchedUser?.name}
            {onlineUser.some((user) => user.userId === fetchedUser._id) && (
              <p className="text-xs flex items-center text-green-700">
                <span>
                  <GoDotFill fill="green" />
                </span>
                {typingUser === selectedChat._id ? "typing..." : "online"}
              </p>
            )}
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
