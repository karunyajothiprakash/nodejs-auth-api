// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./register.jsx";  
import ForgotPassword from "./forgotpassword.jsx";
import ResetPassword from "./resetpassword.jsx";
import Login from "./login.jsx";

export default function App() {
  return (
    <Routes>
      {/* Default route -> go to /register */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Auth routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* catch-all (404) */}
      <Route path="*" element={<h2 className="text-center mt-10">404 Not Found</h2>} />
    </Routes>
  );
}
