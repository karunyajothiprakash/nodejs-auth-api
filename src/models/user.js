import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetPasswordToken: String,
  resetPasswordExpires: Date

}, { timestamps: true });

userSchema.methods.createResetPasswordToken = function () {
  console.log("Entering createResetPasswordToken method.");
  // 1. Create raw token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // 2. Hash the token and store in DB
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiry time (10 min example)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;


  console.log( resetToken, this.resetPasswordToken);

  // 4. Return the raw token (email uses this)
  return resetToken;
};

export default mongoose.model("User", userSchema);
