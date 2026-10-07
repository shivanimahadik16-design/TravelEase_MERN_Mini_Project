import { Router } from "express";
import Trip from "../models/Trip.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/mine", protect, async (req, res) => {
  res.json(await Trip.find({ user: req.user._id }).populate("destination", "name state image").sort({ startDate: 1 }));
});

router.post("/", protect, validate("trip"), async (req, res) =>
  res.status(201).json(await Trip.create({ user: req.user._id, ...req.body }))
);

router.delete("/:id", protect, validate("id", "params"), async (req, res) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Trip deleted" });
});

export default router;
