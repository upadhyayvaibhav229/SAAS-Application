import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const api = "http://localhost:5000/api/users/register";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, form);
      console.log(response);
    } catch (error) {
      console.log("Registration failed", error);
    }
  };

  


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border-2">
        <h2 className="text-2xl font-semibold text-center mb-6 capitalize">Create your <span className="text-yellow-500">account</span> </h2>

        <button className="w-full border border-gray-400 p-2 rounded  transition-all duration-200 text-center hover:rounded-full cursor-pointer">
          Sign up with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-500" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t border-gray-500" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2">

            <div className="relative w-full">
              <input
                type="text"
                id="email"
                placeholder=" "
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
              />
              <label
                htmlFor="email"
                className="absolute left-2 top-5 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500 text-xl"
              >
                First Name
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                id="email"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder=" "
                className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
              />
              <label
                htmlFor="lastname"
                className="absolute left-2 top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500 "
              >
                Last Name
              </label>
            </div>

          </div>

          <div className="relative w-full">
            <input
              type="text"
              id="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder=""
              className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
            />
            <label
              htmlFor="email"
              className="absolute left-2 top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500 "
            >
              Email
            </label>
          </div>
          
          <div className="relative w-full">
            <input
              type="password"
              id="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder=""
              className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
            />
            <label
              htmlFor="password"
              className="absolute left-2 top-5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500 "
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-all duration-300 cursor-pointer hover:rounded-full"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
