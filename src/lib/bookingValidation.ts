import * as z from "zod";
import { format } from "date-fns";
import { Booking } from "@/types";

export const createBookingFormSchema = (roomId: string, currentBookingId: string | undefined, currentMockBookings: Booking[]) => z.object({
  title: z.string().min(2, { message: "Il titolo deve contenere almeno 2 caratteri." }),
  organizer: z.string().min(2, { message: "Il nome dell'organizzatore deve contenere almeno 2 caratteri." }),
  date: z.date({ required_error: "Seleziona una data per la prenotazione." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato ora non valido (HH:MM)." }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato ora non valido (HH:MM)." }),
}).refine((data) => {
  const start = new Date(data.date);
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(data.date);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);
  end.setHours(endHour, endMinute, 0, 0);

  return end > start;
}, {
  message: "L'ora di fine deve essere successiva all'ora di inizio.",
  path: ["endTime"],
}).refine((data) => {
    const { date, startTime, endTime } = data;

    const newBookingStart = new Date(date);
    const [newStartHour, newStartMinute] = startTime.split(':').map(Number);
    newBookingStart.setHours(newStartHour, newStartMinute, 0, 0);

    const newBookingEnd = new Date(date);
    const [newEndHour, newEndMinute] = endTime.split(':').map(Number);
    newBookingEnd.setHours(newEndHour, newEndMinute, 0, 0);

    const existingBookingsForRoomAndDate = currentMockBookings.filter(
      (booking) =>
        booking.roomId === roomId &&
        booking.id !== currentBookingId &&
        format(booking.startTime, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    const hasOverlap = existingBookingsForRoomAndDate.some((existingBooking) => {
      const existingStart = existingBooking.startTime;
      const existingEnd = existingBooking.endTime;

      return (
        (newBookingStart < existingEnd && newBookingEnd > existingStart)
      );
    });

    return !hasOverlap;
  }, {
    message: "La sala è già prenotata per questo intervallo di tempo.",
    path: ["startTime"],
  });