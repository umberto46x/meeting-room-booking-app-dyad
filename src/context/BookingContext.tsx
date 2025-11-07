"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Room, Booking } from "@/types";
import { mockRooms as initialMockRooms, mockBookings as initialMockBookings } from "@/data/mockData";

interface BookingContextType {
  rooms: Room[];
  bookings: Booking[];
  addBooking: (newBooking: Booking) => void;
  deleteBooking: (bookingId: string) => void;
  updateBooking: (updatedBooking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(initialMockRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialMockBookings);

  const addBooking = useCallback((newBooking: Booking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
  }, []);

  const deleteBooking = useCallback((bookingId: string) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
  }, []);

  const updateBooking = useCallback((updatedBooking: Booking) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
    );
  }, []);

  // In a real application, you would fetch data here and handle persistence.
  // For mock data, we just initialize it once.

  const value = {
    rooms,
    bookings,
    addBooking,
    deleteBooking,
    updateBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};