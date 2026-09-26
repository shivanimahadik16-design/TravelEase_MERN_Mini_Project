import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Destination from "./models/Destination.js";
import Hotel from "./models/Hotel.js";
import Activity from "./models/Activity.js";
import Booking from "./models/Booking.js";
import Trip from "./models/Trip.js";

await connectDB();

await Promise.all([
  User.deleteMany({}),
  Destination.deleteMany({}),
  Hotel.deleteMany({}),
  Activity.deleteMany({}),
  Booking.deleteMany({}),
  Trip.deleteMany({})
]);

const [admin, user] = await User.create([
  {
    name: "TravelEase Admin",
    email: "admin@travelease.com",
    password: await bcrypt.hash("Admin@123", 10),
    role: "admin"
  },
  {
    name: "Demo User",
    email: "user@travelease.com",
    password: await bcrypt.hash("User@123", 10),
    role: "user"
  }
]);

const destinations = await Destination.insertMany([
  {
    name: "Goa",
    state: "Goa",
    description: "Beaches, forts, food and relaxed coastal experiences.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    bestTime: "November to February",
    tags: ["beach", "food", "heritage"]
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    description: "Mountain scenery, adventure activities and cool weather.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to June",
    tags: ["mountains", "adventure", "snow"]
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "Historic forts, palaces, markets and local cuisine.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    bestTime: "October to March",
    tags: ["heritage", "culture", "shopping"]
  }
]);

const hotels = await Hotel.insertMany([
  {
    name: "Sea Breeze Resort",
    destination: destinations[0]._id,
    description: "Comfortable stay close to the beach.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 2800,
    facilities: ["Wi-Fi", "Pool", "Breakfast"],
    availableRooms: 12
  },
  {
    name: "Mountain View Inn",
    destination: destinations[1]._id,
    description: "Cozy hotel with valley views.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 3200,
    facilities: ["Wi-Fi", "Parking", "Restaurant"],
    availableRooms: 8
  },
  {
    name: "Pink City Palace Hotel",
    destination: destinations[2]._id,
    description: "Traditional-inspired hotel near major attractions.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 3500,
    facilities: ["Wi-Fi", "Breakfast", "Rooftop"],
    availableRooms: 10
  }
]);

const activities = await Activity.insertMany([
  {
    name: "North Goa Beach Tour",
    destination: destinations[0]._id,
    description: "Visit popular beaches and viewpoints.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    price: 1200,
    duration: "6 hours"
  },
  {
    name: "Solang Valley Adventure",
    destination: destinations[1]._id,
    description: "Enjoy scenic views and outdoor activities.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    price: 1800,
    duration: "5 hours"
  },
  {
    name: "Jaipur Heritage Walk",
    destination: destinations[2]._id,
    description: "Explore historic streets, markets and landmarks.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    price: 900,
    duration: "3 hours"
  }
]);

await Booking.insertMany([
  {
    user: user._id,
    type: "hotel",
    hotel: hotels[0]._id,
    travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    guests: 2,
    amount: hotels[0].pricePerNight * 2,
    status: "confirmed"
  },
  {
    user: user._id,
    type: "activity",
    activity: activities[0]._id,
    travelDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    guests: 2,
    amount: activities[0].price * 2,
    status: "confirmed"
  },
  {
    user: user._id,
    type: "hotel",
    hotel: hotels[1]._id,
    travelDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    guests: 1,
    amount: hotels[1].pricePerNight,
    status: "cancelled"
  }
]);

await Trip.create({
  user: user._id,
  destination: destinations[0]._id,
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  itinerary: [
    { day: 1, title: "Day 1", details: "Arrive in Goa, check in to Sea Breeze Resort & relax at Calangute beach." },
    { day: 2, title: "Day 2", details: "North Goa beach tour, watersports & sunset view from Chapora fort." },
    { day: 3, title: "Day 3", details: "Explore historic Old Goa churches, local spice plantation & farewell dinner." }
  ]
});

console.log("Seed complete with destinations, hotels, activities, bookings, and trip itinerary.");
console.log("Admin account:", admin.email, " / Admin@123");
console.log("User account :", user.email, " / User@123");
process.exit(0);
