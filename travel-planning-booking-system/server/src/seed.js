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

async function seedAccount({ name, email, password, role, resetPassword = false }) {
  if (!email && !password) return null;
  if (!email || !password) {
    throw new Error(`Both SEED_${role.toUpperCase()}_EMAIL and SEED_${role.toUpperCase()}_PASSWORD are required`);
  }

  const accountFields = {
    name: name || (role === "admin" ? "TravelEase Admin" : "Sample Traveler"),
    email: email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role
  };

  return User.findOneAndUpdate(
    { email: accountFields.email },
    resetPassword ? { $set: accountFields } : { $setOnInsert: accountFields },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

const admin = await seedAccount({
  name: process.env.SEED_ADMIN_NAME,
  email: process.env.SEED_ADMIN_EMAIL || "admin@travelease.com",
  password: "admin123",
  role: "admin",
  resetPassword: true
});
const user = await seedAccount({
  name: process.env.SEED_USER_NAME,
  email: process.env.SEED_USER_EMAIL,
  password: process.env.SEED_USER_PASSWORD,
  role: "user"
});

if (await Destination.countDocuments() === 0) {
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
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    description: "Lake city charm with royal palaces and serene sunset viewpoints.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    bestTime: "September to March",
    tags: ["lakes", "palaces", "romantic"]
  },
  {
    name: "Munnar",
    state: "Kerala",
    description: "Tea gardens, cool climate, and misty mountain landscapes.",
    image: "https://images.unsplash.com/photo-1659727777138-92d9bc39928d?auto=format&fit=crop&w=1200&q=80",
    bestTime: "September to May",
    tags: ["tea gardens", "nature", "hill station"]
  },
  {
    name: "Darjeeling",
    state: "West Bengal",
    description: "Scenic Himalayan vistas, tea estates and toy train nostalgia.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    bestTime: "March to June",
    tags: ["himalayas", "tea", "culture"]
  },
  {
    name: "Srinagar",
    state: "Jammu and Kashmir",
    description: "Houseboats, lakes and gardens in the heart of Kashmir.",
    image: "https://images.unsplash.com/photo-1603262110263-fb0112e7f3a6?auto=format&fit=crop&w=1200&q=80",
    bestTime: "April to October",
    tags: ["lakes", "garden", "houseboat"]
  },
  {
    name: "Kasol",
    state: "Himachal Pradesh",
    description: "River valley charm, cafés, trekking and a laid-back backpacker vibe.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    bestTime: "March to October",
    tags: ["trekking", "river", "cafe culture"]
  },
  {
    name: "Leh",
    state: "Ladakh",
    description: "High-altitude desert landscapes, monasteries and thrilling road trips.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    bestTime: "June to September",
    tags: ["adventure", "monasteries", "road trip"]
  },
  {
    name: "Ooty",
    state: "Tamil Nadu",
    description: "Cool mountain air, botanical gardens and colonial-era charm.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    bestTime: "April to June",
    tags: ["hill station", "botanical", "romantic"]
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
  },
  {
    name: "Lakeview Residency",
    destination: destinations[3]._id,
    description: "Elegant rooms with city and lake views.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 4100,
    facilities: ["Wi-Fi", "Spa", "Restaurant"],
    availableRooms: 9
  },
  {
    name: "Tea Valley Retreat",
    destination: destinations[4]._id,
    description: "A serene escape surrounded by tea gardens.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 3700,
    facilities: ["Wi-Fi", "Bonfire", "Breakfast"],
    availableRooms: 11
  },
  {
    name: "Himalayan Heights",
    destination: destinations[5]._id,
    description: "Boutique stay with panoramic mountain views.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 4300,
    facilities: ["Wi-Fi", "Gym", "Mountain View"],
    availableRooms: 7
  },
  {
    name: "Dal Lake Courtyard",
    destination: destinations[6]._id,
    description: "Traditional stay on the banks of the lake.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 3900,
    facilities: ["Lake View", "Houseboat", "Breakfast"],
    availableRooms: 6
  },
  {
    name: "Parvati Pine Stay",
    destination: destinations[7]._id,
    description: "Relaxed mountain lodge with riverside comfort.",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 2500,
    facilities: ["Wi-Fi", "Café", "Parking"],
    availableRooms: 14
  },
  {
    name: "Highland Horizon Hotel",
    destination: destinations[8]._id,
    description: "Warm stay for road-trippers and adventure seekers.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 4700,
    facilities: ["Wi-Fi", "Restaurant", "Helipad"],
    availableRooms: 5
  },
  {
    name: "Misty Peaks Lodge",
    destination: destinations[9]._id,
    description: "Beautiful hill station accommodation with cozy interiors.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    pricePerNight: 3300,
    facilities: ["Wi-Fi", "Breakfast", "Garden"],
    availableRooms: 13
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
  },
  {
    name: "Udaipur Boat Ride",
    destination: destinations[3]._id,
    description: "Experience the beauty of Lake Pichola and city sunsets.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    price: 1400,
    duration: "2 hours"
  },
  {
    name: "Munnar Tea Garden Tour",
    destination: destinations[4]._id,
    description: "Walk through lush tea estates and scenic viewpoints.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    price: 1100,
    duration: "4 hours"
  },
  {
    name: "Darjeeling Himalayan Ride",
    destination: destinations[5]._id,
    description: "Ride through hill roads and visit panoramic lookout points.",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    price: 1500,
    duration: "5 hours"
  },
  {
    name: "Srinagar Shikara Experience",
    destination: destinations[6]._id,
    description: "Cruise on calm waters with Mughal garden views.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    price: 1300,
    duration: "3 hours"
  },
  {
    name: "Kasol Trek & Café Trail",
    destination: destinations[7]._id,
    description: "Enjoy a moderate trek and local café hopping.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    price: 1600,
    duration: "6 hours"
  },
  {
    name: "Leh Monastery Circuit",
    destination: destinations[8]._id,
    description: "Explore iconic monasteries and scenic valleys.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    price: 1900,
    duration: "7 hours"
  },
  {
    name: "Ooty Botanical Garden Walk",
    destination: destinations[9]._id,
    description: "Discover the best of Ooty through gardens and viewpoints.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    price: 950,
    duration: "3 hours"
  }
]);

const sampleUser = user || admin;

if (sampleUser && !(await Booking.exists())) {
await Booking.insertMany([
  {
    user: sampleUser._id,
    type: "hotel",
    hotel: hotels[0]._id,
    travelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    guests: 2,
    amount: hotels[0].pricePerNight * 2,
    status: "confirmed"
  },
  {
    user: sampleUser._id,
    type: "activity",
    activity: activities[0]._id,
    travelDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    guests: 2,
    amount: activities[0].price * 2,
    status: "confirmed"
  },
  {
    user: sampleUser._id,
    type: "hotel",
    hotel: hotels[1]._id,
    travelDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    guests: 1,
    amount: hotels[1].pricePerNight,
    status: "cancelled"
  }
]);
}

if (sampleUser && !(await Trip.exists())) {
await Trip.create({
  user: sampleUser._id,
  destination: destinations[0]._id,
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  itinerary: [
    { day: 1, title: "Day 1", details: "Arrive in Goa, check in to Sea Breeze Resort & relax at Calangute beach." },
    { day: 2, title: "Day 2", details: "North Goa beach tour, watersports & sunset view from Chapora fort." },
    { day: 3, title: "Day 3", details: "Explore historic Old Goa churches, local spice plantation & farewell dinner." }
  ]
});
}
}

const [userCount, destinationCount, hotelCount, activityCount, bookingCount, tripCount] = await Promise.all([
  User.countDocuments(),
  Destination.countDocuments(),
  Hotel.countDocuments(),
  Activity.countDocuments(),
  Booking.countDocuments(),
  Trip.countDocuments()
]);
console.log(`Seed complete: ${userCount} users, ${destinationCount} destinations, ${hotelCount} hotels, ${activityCount} activities, ${bookingCount} bookings, ${tripCount} trips.`);
if (!admin && !user) {
  console.log("Optional seed accounts were not created. Configure SEED_ADMIN_EMAIL/PASSWORD and/or SEED_USER_EMAIL/PASSWORD in server/.env.");
}
process.exit(0);
