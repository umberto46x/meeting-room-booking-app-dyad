"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Room, Booking } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./SessionContext";
import { showError, showSuccess } from "@/utils/toast";

interface BookingContextType {
  rooms: Room[];
  bookings: Booking[];
  addBooking: (newBooking: Omit<Booking, 'id' | 'userId'>) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  updateBooking: (updatedBooking: Omit<Booking, 'userId'>) => Promise<void>;
  isLoadingRooms: boolean;
  isLoadingBookings: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading: isLoadingSession } = useSession();
  const userId = session?.user?.id;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Fetch Rooms
  const fetchRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      console.error("Error fetching rooms:", error);
      showError("Errore nel caricamento delle sale riunioni.");
    } else {
      setRooms(data || []);
    }
    setIsLoadingRooms(false);
  }, []);

  // Fetch Bookings for the current user
  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setIsLoadingBookings(false);
      return;
    }
    setIsLoadingBookings(true);
    const { data, error } = await supabase.from("bookings").select("*").eq("user_id", userId);
    if (error) {
      console.error("Error fetching bookings:", error);
      showError("Errore nel caricamento delle prenotazioni.");
    } else {
      // Convert Supabase data to Booking interface (snake_case to camelCase, string dates to Date objects)
      const formattedBookings: Booking[] = (data || []).map((b: any) => ({
        id: b.id,
        roomId: b.room_id,
        userId: b.user_id,
        title: b.title,
        startTime: new Date(b.start_time),
        endTime: new Date(b.end_time),
        organizer: b.organizer,
      }));
      setBookings(formattedBookings);
    }
    setIsLoadingBookings(false);
  }, [userId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!isLoadingSession) {
      fetchBookings();
    }
  }, [fetchBookings, isLoadingSession]);

  const addBooking = useCallback(async (newBookingData: Omit<Booking, 'id' | 'userId'>) => {
    if (!userId) {
      showError("Devi essere loggato per creare una prenotazione.");
      return;
    }
    const { data, error } = await supabase.from("bookings").insert({
      room_id: newBookingData.roomId,
      user_id: userId,
      title: newBookingData.title,
      start_time: newBookingData.startTime.toISOString(),
      end_time: newBookingData.endTime.toISOString(),
      organizer: newBookingData.organizer,
    }).select();

    if (error) {
      console.error("Error adding booking:", error);
      showError("Errore durante l'aggiunta della prenotazione.");
      throw error;
    } else {
      const addedBooking: Booking = {
        id: data[0].id,
        roomId: data[0].room_id,
        userId: data[0].user_id,
        title: data[0].title,
        startTime: new Date(data[0].start_time),
        endTime: new Date(data[0].end_time),
        organizer: data[0].organizer,
      };
      setBookings((prev) => [...prev, addedBooking]);
      showSuccess("Prenotazione aggiunta con successo!");
    }
  }, [userId]);

  const deleteBooking = useCallback(async (bookingId: string) => {
    if (!userId) {
      showError("Devi essere loggato per eliminare una prenotazione.");
      return;
    }
    const { error } = await supabase.from("bookings").delete().eq("id", bookingId).eq("user_id", userId);

    if (error) {
      console.error("Error deleting booking:", error);
      showError("Errore durante l'eliminazione della prenotazione.");
      throw error;
    } else {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      showSuccess("Prenotazione eliminata con successo!");
    }
  }, [userId]);

  const updateBooking = useCallback(async (updatedBookingData: Omit<Booking, 'userId'>) => {
    if (!userId) {
      showError("Devi essere loggato per aggiornare una prenotazione.");
      return;
    }
    const { data, error } = await supabase.from("bookings").update({
      room_id: updatedBookingData.roomId,
      title: updatedBookingData.title,
      start_time: updatedBookingData.startTime.toISOString(),
      end_time: updatedBookingData.endTime.toISOString(),
      organizer: updatedBookingData.organizer,
    }).eq("id", updatedBookingData.id).eq("user_id", userId).select();

    if (error) {
      console.error("Error updating booking:", error);
      showError("Errore durante l'aggiornamento della prenotazione.");
      throw error;
    } else {
      const updated: Booking = {
        id: data[0].id,
        roomId: data[0].room_id,
        userId: data[0].user_id,
        title: data[0].title,
        startTime: new Date(data[0].start_time),
        endTime: new Date(data[0].end_time),
        organizer: data[0].organizer,
      };
      setBookings((prev) =>
        prev.map((booking) => (booking.id === updated.id ? updated : booking))
      );
      showSuccess("Prenotazione aggiornata con successo!");
    }
  }, [userId]);

  const value = {
    rooms,
    bookings,
    addBooking,
    deleteBooking,
    updateBooking,
    isLoadingRooms,
    isLoadingBookings,
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