import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function Forgotpassword() {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:7002/api/auth/forgot-password",
        { email }
      );

      setMessage(
        res.data?.message ||
          "Password reset link has been generated. Check your email."
      );

      // just to see the URL while testing (optional)
      console.log("reset URL from backend:", res.data?.resetURL);
    } catch (err) {
      console.error("Forgot password Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </div>

        {message && (
          <p className="mb-4 text-green-600 text-center text-sm">{message}</p>
        )}

        {error && (
          <p className="mb-4 text-red-600 text-center text-sm">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}