import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const response = await axios.post("/api/auth/login", { email, password });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError("Server Error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 from-50% to-gray-100 to-50% py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Leave Management</h2>
          <p className="mt-2 text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@company.com"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {loginError && <p className="text-sm text-red-600">{loginError}</p>}

          <button
            type="submit"
            className="w-full rounded bg-red-600 px-4 py-3 text-white hover:bg-indigo-700"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New employee?{' '}
          <Link to="/register" className="font-semibold text-red-600 hover:text-indigo-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
