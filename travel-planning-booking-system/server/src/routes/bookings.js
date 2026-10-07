import { Router } from "express";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Activity from "../models/Activity.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/mine", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hotel", "name image pricePerNight")
    .populate("activity", "name image price")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

router.post("/", protect, validate("booking"), async (req, res) => {
  const { type, hotel, activity, travelDate, guests } = req.body;
  let amount;
  if (type === "hotel") {
    const item = await Hotel.findById(hotel);
    if (!item) {
      const error = new Error("Hotel not found");
      error.statusCode = 404;
      throw error;
    }
    if (item.availableRooms < 1) {
      const error = new Error("No rooms available");
      error.statusCode = 400;
      throw error;
    }
    amount = item.pricePerNight * guests;
    item.availableRooms -= 1;
    await item.save();
  } else {
    const item = await Activity.findById(activity);
    if (!item) {
      const error = new Error("Activity not found");
      error.statusCode = 404;
      throw error;
    }
    amount = item.price * guests;
  }

  const booking = await Booking.create({
    user: req.user._id, type, hotel, activity, travelDate, guests, amount
  });

  res.status(201).json(await booking.populate([
    { path: "hotel", select: "name image pricePerNight" },
    { path: "activity", select: "name image price" }
  ]));
});

router.patch("/:id/cancel", protect, validate("id", "params"), async (req, res) => {
  const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const booking = await Booking.findOne(filter);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }
  if (booking.status === "cancelled") return res.json(booking);
  
  booking.status = "cancelled";
  await booking.save();

  if (booking.type === "hotel" && booking.hotel) {
    await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: 1 } });
  }
  res.json(booking);
});

router.patch("/:id/status", protect, adminOnly, validate("id", "params"), validate("bookingStatus"), async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "cancelled" && status === "cancelled" && booking.type === "hotel" && booking.hotel) {
    await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: 1 } });
  } else if (booking.status === "cancelled" && status === "confirmed" && booking.type === "hotel" && booking.hotel) {
    await Hotel.findByIdAndUpdate(booking.hotel, { $inc: { availableRooms: -1 } });
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
});

router.get("/all", protect, adminOnly, async (req, res) => {
  res.json(await Booking.find()
    .populate("user", "name email")
    .populate("hotel", "name pricePerNight")
    .populate("activity", "name price")
    .sort({ createdAt: -1 }));
});

export default router;
