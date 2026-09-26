import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["hotel", "activity"], required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    travelDate: { type: Date, required: true },
    guests: { type: Number, default: 1, min: 1 },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
