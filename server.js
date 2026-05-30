// ./server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cooler-six.vercel.app",
  "https://www.quicknest.online",
  "https://quicknest.online", // added
];

// Debug incoming origins
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log("Origin:", req.headers.origin);
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests and approved origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked Origin:", origin);

    return callback(
      new Error(`CORS policy blocked origin: ${origin}`)
    );
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

app.use("/api/orders", orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();