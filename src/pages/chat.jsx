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
  const [isSmallScreen, setIsSmallScreen] = useState(false);
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

  const handleClick = () => {};

  useEffect(() => {
    fetch();
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SocketProvider>
      <div className="w-screen h-screen overflow-hidden">
        <div className="w-full h-full flex gap-2 pt-2">
          <Sidebar />
          <div className="w-full  md:w-[600px] h-full flex flex-col gap-y-1 p-1 bg-neutral-950 overflow-y-auto">
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
          {!isSmallScreen && (
            <div className="md:w-full">
              {selectedChat ? (
                <SingleChat />
              ) : (
                <p className=" h-full w-full flex items-center justify-center bg-neutral-900">
                  Select a chat to start a conversation{" "}
                </p>
              )}
            </div>
          )}
          {isSmallScreen && selectedChat && (
            <div className="fixed inset-0 z-50">{<SingleChat />}</div>
          )}
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
