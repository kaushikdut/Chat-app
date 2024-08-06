import React from "react";

const SameSender = ({ message, scrollRef, time }) => {
  const date = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full flex justify-end select-text">
      <div className=" w-full h-auto rounded-md flex justify-end">
        <div className=" p-2 flex flex-col items-start rounded-md bg-gray-800  my-[2px] t">
          <p className="pr-16"> {message}</p>

          <span className="text-xs font-medium text-end w-full">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default SameSender;
