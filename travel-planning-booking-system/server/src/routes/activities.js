import { Router } from "express";
import Activity from "../models/Activity.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = req.query.destination ? { destination: req.query.destination } : {};
    res.json(await Activity.find(filter).populate("destination", "name state").sort({ price: 1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Activity.findById(req.params.id).populate("destination", "name state");
    if (!item) return res.status(404).json({ message: "Activity not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid activity id" });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Activity.create(req.body)); }
  catch (error) { res.status(400).json({ message: error.message }); }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try { res.json(await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); }
  catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: "Activity deleted" });
});

export default router;
