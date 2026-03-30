// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 引入 AuthProvider
import { Toaster } from "react-hot-toast";

// 引入元件與頁面
import HomePage from "./pages/HomePage";
import Navbar from "./components/navbar";
import LoginPage from "./pages/Login";
import MyBookingPage from "./pages/MyBooking";
import BookingPage from "./pages/BookingPage";
import AdminRoomPage from "./pages/AdminRoomPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-light min-vh-100">
          <Navbar />

          <Toaster position="top-center" reverseOrder={false} />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/my-bookings" element={<MyBookingPage />} />
            <Route path="/book/:roomId" element={<BookingPage />} />
            <Route path="/admin/rooms" element={<AdminRoomPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
