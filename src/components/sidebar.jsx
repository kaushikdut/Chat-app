import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/context";
import { toast } from "react-toastify";
import { useSocket } from "../context/socket";
import { IoMdMenu } from "react-icons/io";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setUser, setSelectedChat, user } = useAuthContext();
  const { socket } = useSocket();

  const handleLogout = (e) => {
    e.preventDefault();
    if (socket) {
      socket.current.emit("removeUser", user.id);
      socket.current.disconnect();
      setUser(null);
      setSelectedChat(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className=" w-12 h-full flex flex-col bg-neutral-950 items-center justify-end py-4">
      <div onClick={() => setOpen((prev) => !prev)}>
        <IoMdMenu className="h-8 w-8 md:h-6 md:w-6" />
      </div>
      {open && (
        <div className="bg-neutral-800 w-[150px] h-auto py-4 px-2 flex flex-col items-start absolute left-10 rounded-lg gap-y-2">
          <div className="flex flex-col items-start w-full gap-y-3 px-2">
            <img src="/profile.jpg" className="w-11 h-11 rounded-full" />
            <p>{user.name}</p>
          </div>
          <button
            className="hover:bg-neutral-950 border-none hover:border-none hover:outline-none"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
