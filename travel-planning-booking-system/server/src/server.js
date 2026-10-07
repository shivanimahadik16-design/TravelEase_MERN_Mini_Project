import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import destinationRoutes from "./routes/destinations.js";
import hotelRoutes from "./routes/hotels.js";
import activityRoutes from "./routes/activities.js";
import tripRoutes from "./routes/trips.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "TravelEase API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

    // Diagnostic: log connected MongoDB info and current user count to help debug persistence issues
    try {
      const db = mongoose.connection;
      const host = db.client.s.options.servers?.map(s => `${s.host}:${s.port}`).join(",") || db.host || "unknown";
      console.log(`Connected DB name: ${db.name || "unknown"}, host: ${host}`);

      const userCount = await User.countDocuments();
      console.log(`User documents in database: ${userCount}`);
    } catch (err) {
      console.warn("Diagnostic check failed:", err.message);
    }

    return server;
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
