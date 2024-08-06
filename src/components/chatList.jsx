import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import axios from "axios";
import { useSocket } from "../context/socket";

const ChatList = ({ id, name, image, onClick }) => {
  let time;
  const { token } = useAuthContext();
  const [fetchedMessage, setFetchedMessage] = useState(null);
  const [content, setContent] = useState("");
  const url = import.meta.env.VITE_SERVER;
  const { socket } = useSocket();

  const fetchMessages = async () => {
    try {
      await axios
        .get(`${url}/message/fetch/${id}`, {
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

  useEffect(() => {
    fetchMessages();
  }, [id]);

  if (fetchedMessage) {
    time = fetchedMessage
      ? new Date(fetchedMessage.createdAt).toLocaleTimeString()
      : new Date().toLocaleTimeString();
  }

  useEffect(() => {
    socket.current.on("new-message", () => {
      fetchMessages();
    });
  }, []);

  return (
    <div
      className=" w-full h-[5rem] flex flex-row items-center justify-evenly p-6 bg-neutral-900 cursor-pointer select-none hover:bg-neutral-800"
      onClick={onClick}
    >
      <div className="w-full flex gap-x-3 pr-3 justify-center items-center">
        <img
          src={image ? image : "src/assets/profile.jpg"}
          alt="pic"
          className="rounded-full h-12 w-12"
        />
        <div className=" h-full flex flex-col items-start gap-1">
          <div> {name}</div>
          <div className="w-[10rem] flex">
            <span className="truncate text-xs text-neutral-300">
              {fetchedMessage ? fetchedMessage.message : ""}
            </span>
          </div>
        </div>
        <div className="text-xs">{time}</div>
      </div>
    </div>
  );
};

export default ChatList;
