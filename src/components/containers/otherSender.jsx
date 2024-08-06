import React from "react";

const OtherSender = ({ message, scrollRef, time }) => {
  const date = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className=" w-full flex">
      <div className="w-auto h-auto rounded-md flex flex-col justify-start select-all">
        <div className=" p-2 flex flex-col items-start rounded-md bg-gray-800  my-[2px] t">
          <p className="pr-16"> {message}</p>

          <span className="text-xs font-medium text-end w-full">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default OtherSender;
