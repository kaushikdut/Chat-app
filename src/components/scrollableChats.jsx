import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/context";
import SameSender from "./containers/sameSender";
import OtherSender from "./containers/otherSender";

const ScrollableChats = ({ messages }) => {
  const [send, setSend] = useState(false);
  const { user } = useAuthContext();
  const scrollRef = useRef(null);

  if (messages) {
    console.log(messages);
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      {messages?.map((message) => {
        console.log(message.sender._id === user.id);
        return message.sender._id === user.id ? (
          <SameSender
            key={message._id}
            message={message.message}
            scrollRef={scrollRef}
          />
        ) : (
          <OtherSender
            key={message._id}
            message={message.message}
            scrollRef={scrollRef}
          />
        );
      })}
    </>
  );
};

export default ScrollableChats;
