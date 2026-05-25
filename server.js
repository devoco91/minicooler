import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite frontend
      "http://localhost:3000",
    ],
    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "PUT",
    ],
    credentials: true,
  })
);

// explicit headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  res.header(
    "Access-Control-Allow-Credentials",
    "true"
  );

  next();
});

app.use(express.json());

app.use("/api/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });