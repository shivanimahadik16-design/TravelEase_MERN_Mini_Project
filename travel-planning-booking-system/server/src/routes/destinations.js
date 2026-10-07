import { Router } from "express";
import Destination from "../models/Destination.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", validate("destinationQuery", "query"), async (req, res) => {
  const q = req.validated.query.q;
  const escapedQuery = q?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = q
    ? { $or: [{ name: new RegExp(escapedQuery, "i") }, { state: new RegExp(escapedQuery, "i") }, { tags: new RegExp(escapedQuery, "i") }] }
    : {};
  res.json(await Destination.find(filter).sort({ createdAt: -1 }));
});

router.get("/:id", validate("id", "params"), async (req, res) => {
  const item = await Destination.findById(req.params.id);
  if (!item) {
    const error = new Error("Destination not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.post("/", protect, adminOnly, validate("destination"), async (req, res) =>
  res.status(201).json(await Destination.create(req.body))
);

router.put("/:id", protect, adminOnly, validate("id", "params"), validate("destination"), async (req, res) => {
  const item = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    const error = new Error("Destination not found");
    error.statusCode = 404;
    throw error;
  }
  res.json(item);
});

router.delete("/:id", protect, adminOnly, validate("id", "params"), async (req, res) => {
  const item = await Destination.findByIdAndDelete(req.params.id);
  if (!item) {
    const error = new Error("Destination not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Destination deleted" });
});

export default router;
