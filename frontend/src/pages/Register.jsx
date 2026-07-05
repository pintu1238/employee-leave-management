import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        department,
      });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/employee-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          {/* <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <span className="text-3xl">👤</span>
          </div> */}
          <h2 className="text-3xl font-bold text-gray-900">Create Employee Account</h2>
          <p className="mt-2 text-gray-500">Join the leave management system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Amit"
                className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Sharma"
                className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="amit@company.com"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              id="department"
              placeholder="HR, Finance, IT..."
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Min 6 chars"
                className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repeat password"
                className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-red-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
