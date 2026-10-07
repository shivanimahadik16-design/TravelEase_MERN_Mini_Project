import { Router } from "express";
import Hotel from "../models/Hotel.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", validate("catalogQuery", "query"), async (req, res) => {
  const destination = req.validated.query.destination;
  const filter = destination ? { destination } : {};
  res.json(await Hotel.find(filter).populate("destination", "name state").sort({ pricePerNight: 1 }));
});

router.get("/:id", validate("id", "params"), async (req, res) => {
  const item = await Hotel.findById(req.params.id).populate("destination", "name state");
  if (!item) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.post("/", protect, adminOnly, validate("hotel"), async (req, res) =>
  res.status(201).json(await Hotel.create(req.body))
);

router.put("/:id", protect, adminOnly, validate("id", "params"), validate("hotel"), async (req, res) => {
  const item = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.delete("/:id", protect, adminOnly, validate("id", "params"), async (req, res) => {
  const item = await Hotel.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Hotel deleted" });
});

export default router;
