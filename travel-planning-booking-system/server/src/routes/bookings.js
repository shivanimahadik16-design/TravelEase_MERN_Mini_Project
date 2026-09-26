import { Router } from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Activity from "../models/Activity.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/mine", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hotel", "name image pricePerNight")
    .populate("activity", "name image price")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

router.post("/", protect, async (req, res) => {
  try {
    const { type, hotel, activity, travelDate, guests = 1 } = req.body;
    if (!type || !travelDate || !guests) {
      return res.status(400).json({ message: "Type, date and guests are required" });
    }

    let amount;
    if (type === "hotel") {
      const item = await Hotel.findById(hotel);
      if (!item) return res.status(404).json({ message: "Hotel not found" });
      if (item.availableRooms < 1) return res.status(400).json({ message: "No rooms available" });
      amount = item.pricePerNight * guests;
      item.availableRooms -= 1;
      await item.save();
    } else if (type === "activity") {
      const item = await Activity.findById(activity);
      if (!item) return res.status(404).json({ message: "Activity not found" });
      amount = item.price * guests;
    } else {
      return res.status(400).json({ message: "Invalid booking type" });
    }

    const booking = await Booking.create({
      user: req.user._id, type, hotel, activity, travelDate, guests, amount
    });

    res.status(201).json(await booking.populate([
      { path: "hotel", select: "name image pricePerNight" },
      { path: "activity", select: "name image price" }
    ]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/cancel", protect, async (req, res) => {
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const booking = await Booking.findOne(filter);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "cancelled") return res.json(booking);
  
  booking.status = "cancelled";
  await booking.save();

  if (booking.type === "hotel" && booking.hotel) {
    await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: 1 } });
  }
  res.json(booking);
});

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "cancelled" && status === "cancelled" && booking.type === "hotel" && booking.hotel) {
      await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: 1 } });
    } else if (booking.status === "cancelled" && status === "confirmed" && booking.type === "hotel" && booking.hotel) {
      await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: -1 } });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", protect, adminOnly, async (req, res) => {
  res.json(await Booking.find()
    .populate("user", "name email")
    .populate("hotel", "name pricePerNight")
    .populate("activity", "name price")
    .sort({ createdAt: -1 }));
});

export default router;
