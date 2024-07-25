import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import ChatList from "../components/chatList";
import SingleChat from "../components/singleChat";
import Sidebar from "../components/sidebar";

const Chat = () => {
  const { user, chats, setChats, setSelectedChat, selectedChat, token } =
    useAuthContext();
  const [chat, setChat] = useState([]);

  const url = import.meta.env.VITE_SERVER;

  const fetch = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios
        .get(`${url}/auth/users`)
        .then((response) => {
          setChat(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.log("fetching errors", err);
        });
    } catch (error) {
      console.log("Internal Errors, error:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="w-full h-full flex gap-2 pl-2 pt-2">
        <div className="w-[45%] h-full flex flex-col gap-y-1 p-1 bg-neutral-950 overflow-y-auto">
          {chat?.map((data) => {
            return data._id !== user.id ? (
              <ChatList
                name={data.name}
                key={data._id}
                image={data.picture}
                time={data.timestamp}
                content={data.content}
                onClick={() => setSelectedChat(data)}
              />
            ) : (
              ""
            );
          })}
        </div>
        <div className="w-full">
          <SingleChat />
        </div>
      </div>
    </div>
  );
};

export default Chat;
