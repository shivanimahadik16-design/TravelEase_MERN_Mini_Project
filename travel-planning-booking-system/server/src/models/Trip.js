import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    itinerary: [
      {
        day: Number,
        title: String,
        details: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
