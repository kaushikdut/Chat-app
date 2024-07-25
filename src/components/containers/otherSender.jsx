import React from "react";

const OtherSender = ({ message, scrollRef }) => {
  return (
    <div className=" w-full">
      <div className="w-full h-auto rounded-md flex flex-col justify-start">
        <div className=" p-2 flex flex-col items-start rounded-md bg-gray-800 pr-10 my-[2px]">
          {message}
          <span ref={scrollRef}></span>
        </div>
      </div>
    </div>
  );
};

export default OtherSender;
