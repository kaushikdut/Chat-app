import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useAuthContext } from "../context/context";

function Login() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const [viewPassword, setViewPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const url = import.meta.env.VITE_SERVER;

  const { setToken, setUser, user, setIsAuthenticated } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.email.includes("@") && formdata.password.length > 7) {
      await axios
        .post(`${url}/auth/login`, formdata)
        .then((response) => {
          const { token, message, ...other } = response.data;

          toast.success(message, {
            position: "bottom-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          toast.clearWaitingQueue();

          setToken(token);
          setUser(other);
          setTimeout(() => navigate("/"), 4000);
        })
        .catch((error) => {
          console.log(error?.response);
          toast.error(error.response?.data, {
            position: "top-right",

            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
          toast.clearWaitingQueue();
        });
    } else {
      toast.error("Invalid email or password", {
        position: "top-right",

        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      toast.clearWaitingQueue();
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleView = () => {
    setViewPassword((prev) => !prev);
  };

  return (
    <div
      className="w-screen h-full flex items-center justify-center"
      style={{
        backgroundImage: "url(bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[450px] h-[600px] bg-white flex flex-col items-center rounded-md py-6">
        <div className="w-full h-[18rem] flex items-center justify-center">
          <h1 className="text-black">Login</h1>
        </div>
        <div className="w-full h-full flex flex-col py-6 gap-y-5 items-center ml-4">
          <div className="relative z-10 ">
            <input
              className="w-[25rem] h-10 px-2 text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-700 ease-in-out delay-200 focus:placeholder-transparent"
              placeholder={"Email"}
              name="email"
              type="email"
              value={formdata.email}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeydown}
            />

            <span className="text-black absolute left-[-15px] top-3 ">
              {isFocused ? <FaUser fill="black" /> : <FaUser fill="gray" />}
            </span>
          </div>

          <div className="relative z-10">
            <input
              className="w-[25rem] h-10 px-2  text-black bg-transparent border-b-[1px] border-gray-200  focus:border-black focus:outline-none transition duration-1000 ease-in-out delay-200 focus:placeholder-transparent"
              placeholder="Password"
              name="password"
              type={viewPassword ? "text" : "password"}
              value={formdata.password}
              onChange={handleChange}
              onKeyDown={handleKeydown}
            />
            <span
              role="button"
              className="text-black absolute top-[10px] right-[10px] "
              onClick={handleView}
            >
              {viewPassword ? (
                <FaRegEyeSlash className="w-6 h-4" />
              ) : (
                <FaRegEye className="w-6 h-4" />
              )}
            </span>
          </div>

          <div>
            <h3 className="text-gray-600">
              Don't have an {""}
              <span>
                <Link to={"/register"} className="hover:text-purple-600">
                  account
                </Link>
              </span>
            </h3>
          </div>
          <button
            className=" focus:outline-none bg-gradient-to-r from-rose-600 to-indigo-800 hover:delay-1000 hover:from-indigo-800 hover:to-rose-600 w-[15rem] rounded-full"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
