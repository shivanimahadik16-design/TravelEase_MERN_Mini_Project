import { Router } from "express";
import Hotel from "../models/Hotel.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.query.destination ? { destination: req.query.destination } : {};
    res.json(await Hotel.find(filter).populate("destination", "name state").sort({ pricePerNight: 1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Hotel.findById(req.params.id).populate("destination", "name state");
    if (!item) return res.status(404).json({ message: "Hotel not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid hotel id" });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Hotel.create(req.body)); }
  catch (error) { res.status(400).json({ message: error.message }); }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try { res.json(await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
  catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: "Hotel deleted" });
});

export default router;
