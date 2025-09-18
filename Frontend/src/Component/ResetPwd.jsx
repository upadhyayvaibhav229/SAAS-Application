import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

const ResetPwd = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, SetOTP] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState("");
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  // on submit email
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      }
    } catch (error) {
      console.log("email not sent", error);
      toast.error(error.message);
    }
  };

  // on submit otp
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    SetOTP(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(
        `${backendUrl}/api/v1/auth/reset-password`,
        {email, otp, newPassword}
      )
      data.success ? toast.success(data.message)  : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)  
    }
  }

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
    const values = e.clipboardData.getData("Text").split("");
    values.forEach((value, index) => {
      inputRef.current[index].value = value;
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white ">
      {/* email input form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
          <p className="mb-4">
            Enter your registered email to reset your password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-md bg-[#333A5C]">
            <img src={assets.mail_icon} alt="logo" className="w-2 h-2" />
            <input
              type="email"
              placeholder="Email"
              className=" outline-none text-white relative w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer  "
          >
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}

      {!isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-100 text-sm">
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
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer  "
          >
            Submit
          </button>
        </form>
      )}

      {/* new password form */}
      {isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
          <p className="mb-4">Enter your new password</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-md bg-[#333A5C]">
            <img src={assets.lock_icon} alt="logo" className="w-6 h-6" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white relative"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer  "
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPwd;
