import React, { useState } from 'react'
import "./App.css";
import axios from "axios";  
export default function Login() {
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[forgotpassword,setForgotpassword]=useState("");

    const[error,setError]=useState("");
    const[message,setMessage]=useState("");


    const handleSubmit = async(e) =>{
    e.preventDefault();
    setMessage("");
    setError("");

    const data ={email,password,forgotpassword,error,message};
    try{
        const res =await axios.post(
         "http://localhost:7002/api/auth/login",
         {email,password}
        );

        const data=res.data;
        setMessage(data.message||"Login Successfully");

        if(data.token){
            localStorage.setItem("token",data.token);
        }
        console.log("Token from Backend:",data.token)
           
    }
    catch(error){
    console.error("Login Error:",error);
    setError(
        error.response?.data?.message||"Login failed.Please try again."
    );
    }
    }
  return (
   
  
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
         <div className="text-2xl font-bold mb-6 text-center">LOGIN </div>

         {message && (
          <p className="mb-4 text-green-600 text-center text-sm">{message}
          </p> 
  )}

  {
    error&&(
        <p className='mb-4 text-red-600 text-center text-sm'>{error}</p>
    )
  }
    <form className="space-y-4" onSubmit={handleSubmit}>
<input type='text'
placeholder='Email'
value={email}
className='w-full p-3  border rounded-lg focus:outline-none focus:border-blue-500'

onChange={(e)=>setEmail(e.target.value)}required

/>
<input type='text'
placeholder='Password'
value={password}
onChange={(e)=>setPassword(e.target.value)} required
className='w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500'/>
<div className='flex justify-center'>
<button type='submit'
        className=' w-32 p-2 rounded-lg bg-blue-600 center text-white font-semibold hover:bg-blue-700 transition'>Login</button>
        </div>
    </form>
    <div className='mt-4 text-center'>
      <a href="/forgot-password"
      className='text-sm text-blue-600 hover:underline'
      >Forgot Password?</a>

    </div>
   
    </div>
    </div>
  );
}