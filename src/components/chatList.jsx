import React, { useEffect } from "react";
import { useAuthContext } from "../context/context";

const ChatList = ({ name, image, time, content, onClick }) => {
  //   const fetchChat = async () => {
  //     try {
  //       const url = import.meta.env.VITE_SERVER;

  //       const { data } = await axios.get(`${url}/chat`, {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       });
  //       console.log("Data is" + data);
  //       setChats(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const date = new Date(time);
  const hours = date.toLocaleTimeString();

  return (
    <div
      className=" w-full h-[5rem] flex flex-row items-center justify-evenly p-6 bg-neutral-900 "
      onClick={onClick}
    >
      <div className="w-full flex gap-x-3 pr-3 justify-center items-center">
        <img src={image} alt="pic" className="rounded-full h-12 w-12" />
        <div className=" h-full flex flex-col items-start gap-1">
          <div> {name}</div>
          <div className="w-[10rem] flex">
            <span className="truncate text-xs">{content}</span>
          </div>
        </div>
        <div className="text-xs">{hours}</div>
      </div>
    </div>
  );
};

export default ChatList;
