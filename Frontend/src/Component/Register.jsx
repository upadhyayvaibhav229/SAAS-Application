import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName) {
      setError("Company name is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await registerUser(form);
      if (result.success) {
        navigate("/login");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const generateWorkspaceUrl = (name) =>
    name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border-2">
        <h2 className="text-2xl font-semibold text-center mb-6 capitalize">
          Create your <span className="text-yellow-500">account</span>
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <button onClick={handleNext} className="w-full bg-indigo-600 text-white p-2 rounded">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full border p-2 rounded"
            />
            {form.companyName && (
              <p className="text-sm text-gray-500">
                Workspace URL: {generateWorkspaceUrl(form.companyName)}.yourapp.com
              </p>
            )}
            <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">
              Create Account
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full border p-2 rounded mt-2">
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
