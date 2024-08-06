import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/context";
import ChatList from "../components/chatList";
import SingleChat from "../components/singleChat";
import Sidebar from "../components/sidebar";
import { SocketProvider, useSocket } from "../context/socket";

const Chat = () => {
  const { setSelectedChat, selectedChat } = useAuthContext();
  const [fetchedUser, setFetchedUser] = useState([]);
  const url = import.meta.env.VITE_SERVER;
  const { user } = useAuthContext();

  const fetch = async () => {
    try {
      await axios
        .get(`${url}/auth/users`)
        .then((response) => {
          if (response) {
            setFetchedUser(response.data);
          }
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
    <SocketProvider>
      <div className="w-screen h-screen overflow-hidden">
        <div className="w-full h-full flex gap-2 pt-2">
          <Sidebar />
          <div className="w-[45%] h-full flex flex-col gap-y-1 p-1 bg-neutral-950 overflow-y-auto">
            {fetchedUser?.map((data) => {
              return (
                data._id !== user.id && (
                  <ChatList
                    name={data.name}
                    id={data._id}
                    key={data._id}
                    image={data.picture}
                    onClick={() => setSelectedChat(data)}
                  />
                )
              );
            })}
          </div>
          <div className="w-full">{selectedChat && <SingleChat />}</div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
