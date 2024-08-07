import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/context";
import { toast } from "react-toastify";
import { useSocket } from "../context/socket";

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
    <div className=" w-12 h-full flex flex-col bg-neutral-950 justify-end py-4">
      <div onClick={() => setOpen((prev) => !prev)}>
        <img src="/profile.jpg" className=" rounded-full" />
      </div>
      {open && (
        <div className="bg-neutral-800 w-[150px] h-[70px] p-5 flex flex-col items-center justify-center absolute left-10 rounded-lg">
          <button
            className="hover:bg-neutral-950 border-none hover:border-none hover:outline-none "
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
