import axios from "axios";
import React, { useState } from "react";
import "./App.css";

export default function Resetpassword() {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // token from query string: /reset-password?token=ABC
  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    if (password !== confirmpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:7002/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      setMessage(
        res.data.message || "Password has been reset successfully."
      );
    } catch (error) {
      console.error("reset password Error:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </div>

        {message && (
          <p className="mb-4 text-green-600 text-center text-sm">{message}</p>
        )}

        {error && (
          <p className="mb-4 text-red-600 text-center text-sm">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmpassword}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Reset Password
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
