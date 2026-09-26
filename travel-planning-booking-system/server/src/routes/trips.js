import { Router } from "express";
import Trip from "../models/Trip.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/mine", protect, async (req, res) => {
  res.json(await Trip.find({ user: req.user._id }).populate("destination", "name state image").sort({ startDate: 1 }));
});

router.post("/", protect, async (req, res) => {
  try {
    const { destination, startDate, endDate, itinerary = [] } = req.body;
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: "Destination and dates are required" });
    }
    res.status(201).json(await Trip.create({ user: req.user._id, destination, startDate, endDate, itinerary }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Trip deleted" });
});

export default router;
