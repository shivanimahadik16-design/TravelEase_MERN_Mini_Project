import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    description: String,
    image: String,
    price: { type: Number, required: true },
    duration: String
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
