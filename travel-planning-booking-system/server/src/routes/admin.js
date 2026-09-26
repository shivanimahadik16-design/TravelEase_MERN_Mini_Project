import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Destination from "../models/Destination.js";
import Hotel from "../models/Hotel.js";
import Activity from "../models/Activity.js";
import Booking from "../models/Booking.js";

const router = Router();

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [users, destinations, hotels, activities, bookings, revenueAgg, recentBookings] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Hotel.countDocuments(),
      Activity.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Booking.find()
        .populate("user", "name email")
        .populate("hotel", "name")
        .populate("activity", "name")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      users,
      destinations,
      hotels,
      activities,
      bookings,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
