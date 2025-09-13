import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [step, setStep] = useState(1); // step 1 or 2
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const api = "http://localhost:5000/api/v1/users/register";

  const handleNext = () => {
    // simple validation for step 1
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.companyName) {
      setError("Company name is required");
      return;
    }

    try {
      const res = await axios.post(api, form, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data?.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.log("Registration failed", err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border-2">
        <h2 className="text-2xl font-semibold text-center mb-6 capitalize">
          Create your <span className="text-yellow-500">account</span>
        </h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {step === 1 && (
          <form className="space-y-4">
            <div className="flex gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder=" "
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
                  required
                />
                <label className="absolute left-2 -top-1 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500 text-xl">
                  First Name
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder=" "
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
                  required
                />
                <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative w-full">
              <input
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
                required
              />
              <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                Email
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="password"
                placeholder=" "
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
                required
              />
              <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                Password
              </label>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-all duration-300 cursor-pointer hover:rounded-full"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder=" "
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                className="peer w-full border-b border-gray-400 p-2 pt-6 rounded-md outline-none focus:border-indigo-500"
                required
              />
              <label className="absolute left-2 top-1 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                Company Name
              </label>
            </div>

            {/* Workspace preview */}
            {form.companyName && (
              <p className="text-gray-400 text-sm">
                Workspace URL:{" "}
                <span className="font-mono">
                  {form.companyName.trim().toLowerCase().replace(/\s+/g, "-")}
                  .yoursaas.com
                </span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-all duration-300 cursor-pointer hover:rounded-full"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full border border-gray-400 p-2 rounded hover:rounded-full mt-2"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
