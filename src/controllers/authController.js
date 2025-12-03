// src/controllers/authController.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

import { sendEmail } from "../utils/sendEmail.js";

export const getProfile = async(req,res) =>{
  try{
const userId = req.user.userId;
const user = await User.findById(userId).select("-password");
if(!user){
  return res.status(404).json({message:"User not found"})
}
res.json({
  message:"Profile fetched successfully",
  user,
});
  } 
catch(error){
  res.status(500).json({message:"Server error"});

}

};



// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;


     if(password !==confirmpassword){
      console.log("ERROR: Password and confirm password do not match.");
    return res.status(400).json({message:"The passwords you entered are not the same"})
  }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("ERROR: Email already exists.");
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("Registered User:", user);

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    // 2. Generate password reset token
    const resetToken = user.createResetPasswordToken();

    // Save without validation (important for hashed token)
    await user.save({ validateBeforeSave: false });

    // 3. Build Reset URL (Frontend URL)
    const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;

    // 4. Send Email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Use this link: ${resetURL}`,
        html: `
          <p>You requested a password reset.</p>
          <p>
            Click the link below to reset your password:
            <br/>
            <a href="${resetURL}">${resetURL}</a>
          </p>
        `,
      });

      return res.status(200).json({
        message: "Password reset link sent to your email",
      });
    } catch (err) {
      // If email fails, remove token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "Failed to send reset email. Try again later.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};





// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log("Body received in resetPassword:", req.body);

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Raw token from URL:", token);
    console.log("Hashed token we're searching for:", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("User found for this token:", user);

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update password & clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};