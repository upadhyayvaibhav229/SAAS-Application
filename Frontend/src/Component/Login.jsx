import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const AuthForm = () => {
  const [mode, setMode] = useState("login"); // 'login', 'register', or 'forgot'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn } = useContext(AppContext);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (mode === "login") {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
          setError(data.message);
        }
      }else if (mode === "register") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
          setError(data.message);
        }
      } else if (mode === "forgot") {
        const { data } = await axios.post(`${backendUrl}/api/auth/forgot`, {
          email,
        });
        if (data.success) {
          toast.success(data.message);
          setMode("login");
        } else {
          toast.error(data.message);
          setError(data.message);
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setError("An error occurred. Please try again.");
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

        <form>
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
