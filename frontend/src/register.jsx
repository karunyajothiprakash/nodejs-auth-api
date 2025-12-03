import React, { useState } from "react";
import "./App.css";
import axios from "axios";  
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if(password !== confirmpassword){
    setError("passwords do not match");
    return;
    }
    //const data = { name, email, password, confirmpassword,error,success };

    try {
      const response = await axios.post("http://localhost:7002/api/auth/register",
       {name,
       email,
       password,
       confirmpassword,
       error,
       success,
      }
      );

      const resData =  response.data;
      console.log(resData);
   
    setSuccess(resData.message || "Registered successfully");
      setError("");

      // navigate("/login"); // Removed immediate navigation
    } catch (error) {
      console.error("Error while registering:", error);
      setError(error.response?.data?.message || "Network error, please try again");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-2xl font-bold mb-6 text-center">
          AUTHENTICATION OF USER
        </div>

        {
        success && (
        <p className="mb-4 text-green-600 text-center text-sm">
        {success}
        </p>
        )
        }
        {
        error &&(
<p className="mb-4 text-red-600 text-center text-sm">
{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            REGISTER
          </button>

          
        </form>
      </div>
    </div>
  );
}
