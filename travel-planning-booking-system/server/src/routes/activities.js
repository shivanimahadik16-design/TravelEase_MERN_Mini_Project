import { Router } from "express";
import Activity from "../models/Activity.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", validate("catalogQuery", "query"), async (req, res) => {
  const destination = req.validated.query.destination;
  const filter = destination ? { destination } : {};
  res.json(await Activity.find(filter).populate("destination", "name state").sort({ price: 1 }));
});

router.get("/:id", validate("id", "params"), async (req, res) => {
  const item = await Activity.findById(req.params.id).populate("destination", "name state");
  if (!item) {
    const error = new Error("Activity not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.post("/", protect, adminOnly, validate("activity"), async (req, res) =>
  res.status(201).json(await Activity.create(req.body))
);

router.put("/:id", protect, adminOnly, validate("id", "params"), validate("activity"), async (req, res) => {
  const item = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Activity not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.delete("/:id", protect, adminOnly, validate("id", "params"), async (req, res) => {
  const item = await Activity.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Activity not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Activity deleted" });
});

export default router;
