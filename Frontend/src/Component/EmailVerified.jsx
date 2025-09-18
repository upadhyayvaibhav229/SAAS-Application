import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerified = () => {
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
  const inputRef = useRef([]);
  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRef.current[index + 1].focus();
    } else if (value.length === 0 && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    if (pastedData.length > inputRef.current.length) return;
    pastedData.split("").forEach((value, index) => {
      inputRef.current[index].value = value;
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/verify-account`,
        { otp, userId: userData?._id || userData?.id }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white ">
      <form onSubmit={onSubmitHandler} className="">
        <div className="bg-[#333A5C] text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
          <p className="mb-4">Enter the 6 digit code sent to your email</p>
          <div className="mb-4" onPaste={handlePaste}>
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center border border-gray-300 rounded mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#141f53]"
                ref={(el) => (inputRef.current[index] = el)}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900  hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          >
            Verify email
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailVerified;
