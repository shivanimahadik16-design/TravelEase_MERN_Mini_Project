import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layout components
import UserNavbar from "./components/UserNavbar";
import UserFooter from "./components/UserFooter";
import AdminLayout from "./components/AdminLayout";

// User Portal Pages
import HomePage from "./pages/user/HomePage";
import DestinationsPage from "./pages/user/DestinationsPage";
import DestinationDetailsPage from "./pages/user/DestinationDetailsPage";
import HotelsPage from "./pages/user/HotelsPage";
import ActivitiesPage from "./pages/user/ActivitiesPage";
import BookingPage from "./pages/user/BookingPage";
import BookingsPage from "./pages/user/BookingsPage";
import TripsPage from "./pages/user/TripsPage";
import AuthPage from "./pages/user/AuthPage";

// Admin Portal Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";

// User Layout wrapper
function UserLayoutWrapper({ user, setUser }) {
  return (
    <div className="user-layout">
      <UserNavbar user={user} setUser={setUser} />
      <div className="user-main-content">
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
}

// User Protected Route
function ProtectedUser({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Admin Protected Route
function ProtectedAdmin({ user, setUser }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <AdminLayout user={user} setUser={setUser} />;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  return (
    <Routes>
      {/* 1. CUSTOMER / USER TRAVEL PORTAL (Light, Vibrant Oceanic Aesthetic) */}
      <Route element={<UserLayoutWrapper user={user} setUser={setUser} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/login" element={<AuthPage mode="login" setUser={setUser} />} />
        <Route path="/register" element={<AuthPage mode="register" setUser={setUser} />} />

        {/* User Protected Routes */}
        <Route
          path="/book"
          element={
            <ProtectedUser user={user}>
              <BookingPage />
            </ProtectedUser>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedUser user={user}>
              <BookingsPage />
            </ProtectedUser>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedUser user={user}>
              <TripsPage />
            </ProtectedUser>
          }
        />
      </Route>

      {/* 2. ADMIN COMMAND CENTER PORTAL (Dark Slate Executive Backoffice) */}
      <Route path="/admin" element={<ProtectedAdmin user={user} setUser={setUser} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="activities" element={<AdminActivities />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
