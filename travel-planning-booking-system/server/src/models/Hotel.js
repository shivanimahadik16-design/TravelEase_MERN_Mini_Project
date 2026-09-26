import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    description: String,
    image: String,
    pricePerNight: { type: Number, required: true },
    facilities: [String],
    availableRooms: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
