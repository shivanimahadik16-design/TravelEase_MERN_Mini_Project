import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: "India" },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bestTime: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
