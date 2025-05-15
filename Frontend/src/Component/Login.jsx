import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const AuthForm = () => {
  const [mode, setMode] = useState("login"); // 'login', 'register', or 'forgot'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData, setAccessToken } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (mode === "register") {
        const { data } = await axios.post(`${backendUrl}/api/users/register`, {
          firstName,
          lastName,
          email,
          password,
        });

        console.log("Registration response:", data);

        if (data.success) {
          toast.success("Registration successful");
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      } else {
        // 🔐 Login user
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });

        console.log("Login response:", data);

        if (data.success) {
          toast.success("Login successful");

          // ✅ Use context method to store token
          setAccessToken(data.data.accessToken);

          setIsLoggedIn(true);

          // ✅ Load user data using updated token
          await getUserData();

          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  const renderTitle = () => {
    switch (mode) {
      case "login":
        return "Login";
      case "register":
        return "Register";
      case "forgot":
        return "Forgot Password";
      default:
        return "";
    }
  };

  const renderSwitchText = () => {
    if (mode === "login") {
      return (
        <>
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => setMode("register")}
              className="text-blue-500 underline"
            >
              Register
            </button>
          </p>
          <p>
            Forgot your password?{" "}
            <button
              onClick={() => setMode("forgot")}
              className="text-blue-500 underline"
            >
              Reset
            </button>
          </p>
        </>
      );
    } else {
      return (
        <p>
          Already have an account?{" "}
          <button
            onClick={() => setMode("login")}
            className="text-blue-500 underline"
          >
            Login
          </button>
        </p>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">{renderTitle()}</h2>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="firstName" className="block mb-1 font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label htmlFor="lastName" className="block mb-1 font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== "forgot" && (
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            {renderTitle()}
          </button>
        </form>

        <div className="text-center mt-4">{renderSwitchText()}</div>
      </div>
    </div>
  );
};

export default AuthForm;
