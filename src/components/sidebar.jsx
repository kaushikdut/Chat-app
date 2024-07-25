import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/context";
import { toast } from "react-toastify";
import axios from "axios";

const Sidebar = () => {
  const url = import.meta.env.VITE_SERVER;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchBtn, setSearchBtn] = useState(false);
  const { token, setSelectedChat } = useAuthContext();
  const [users, setUsers] = useState([]);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const fetchUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios
        .get(`${url}/auth/users`)
        .then((response) => setUsers(response.data))
        .catch((err) => {
          console.log("fetching errors", err);
        });
    } catch (error) {
      console.log("Internal Errors, error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Provide username");
      return;
    }

    try {
      await axios
        .get(`${url}/auth/users?search=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => console.log(response));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[5rem] bg-white text-black flex justify-between items-center px-3 select-none">
      <div>
        <div role="button" onClick={() => setSearchBtn((prev) => !prev)}>
          <h2>Search User</h2>
        </div>

        {/* <div className="bg-red-700 w-[20rem] h-[30rem] py-3 px-3 absolute top-[5rem] flex flex-col gap-y-3">
          <div className="flex flex-col gap-y-2">
            {users?.map((user) => (
              <div
                key={user._id}
                className="w-full p-2 bg-white text-black cursor-pointer"
                onClick={() => setSelectedChat(user)}
              >
                {user.name}
              </div>
            ))}
          </div>
        </div> */}
      </div>

      <div>Chataap</div>

      <div className="relative">
        <div
          role="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="select-none"
        >
          Profile
        </div>
        {isOpen && (
          <div className="bg-red-600 w-[10rem] h-[3rem] absolute right-0 top-[5rem] flex flex-col justify-center">
            <div role="button" onClick={handleLogOut}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
