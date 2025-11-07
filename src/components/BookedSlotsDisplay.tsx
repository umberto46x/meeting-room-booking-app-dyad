"use client";

import React from "react";
import { Booking } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { Clock } from "lucide-react";
import NoContentFound from "./NoContentFound";

interface BookedSlotsDisplayProps {
  roomId: string;
  selectedDate: Date;
  allBookings: Booking[];
  currentBookingId?: string; // Optional: for edit mode, to exclude the booking being edited
}

const BookedSlotsDisplay: React.FC<BookedSlotsDisplayProps> = ({
  roomId,
  selectedDate,
  allBookings,
  currentBookingId,
}) => {
  const bookingsForSelectedDay = allBookings.filter(
    (booking) =>
      booking.roomId === roomId &&
      isSameDay(booking.startTime, selectedDate) &&
      booking.id !== currentBookingId // Exclude the current booking if in edit mode
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">
          Slot Prenotati per il {format(selectedDate, "PPP", { locale: it })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingsForSelectedDay.length > 0 ? (
          <div className="space-y-3">
            {bookingsForSelectedDay.map((booking) => (
              <div key={booking.id} className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {format(booking.startTime, "p", { locale: it })} - {format(booking.endTime, "p", { locale: it })}
                  <span className="ml-2 font-medium text-foreground">({booking.title})</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <NoContentFound message="Nessuna prenotazione per questa data." className="py-4" />
        )}
      </CardContent>
    </Card>
  );
};

export default BookedSlotsDisplay;