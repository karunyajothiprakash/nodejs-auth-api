console.log("---- SERVER INITIALIZING (for real this time) ----");
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './src/config/dbConnect.js';
import authRoutes from './src/routes/authRoutes.js';
import { initializeEmailTransporter } from "./src/utils/sendEmail.js"; // Import the new function

dotenv.config();
// Removed temporary console.log for environment variables

initializeEmailTransporter(); // Initialize the transporter AFTER dotenv.config()

dbConnect();

const app = express();

// Universal Request Logger (added for debugging)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Middlewares
app.use(express.json());
app.use(cors()); // Allow all origins for debugging during development

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/ping', (req, res) => {
  res.json({ ok: true });
});

// GLOBAL ERROR HANDLER (must be before listen)
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 7002;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🔥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

export default app;