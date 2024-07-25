import React from "react";

const SameSender = ({ message, scrollRef }) => {
  return (
    <div className="w-full flex justify-end">
      <div className=" w-full h-auto rounded-md flex justify-end">
        <div className=" p-2 flex flex-col items-start rounded-md bg-gray-800 pr-10 my-[2px]">
          {message}
          <span ref={scrollRef}></span>
        </div>
      </div>
    </div>
  );
};

export default SameSender;
