import { Router } from "express";
import Destination from "../models/Destination.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = q
      ? { $or: [{ name: new RegExp(q, "i") }, { state: new RegExp(q, "i") }, { tags: new RegExp(q, "i") }] }
      : {};
    res.json(await Destination.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Destination.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Destination not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid destination id" });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Destination.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ message: "Destination deleted" });
});

export default router;
