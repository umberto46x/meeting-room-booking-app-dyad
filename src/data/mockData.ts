import { Room, Booking } from "@/types";

export const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Sala Riunioni Alpha",
    capacity: 8,
    location: "Piano 1, Ala Est",
    description: "Sala moderna con proiettore e lavagna interattiva.",
  },
  {
    id: "room-2",
    name: "Sala Conferenze Beta",
    capacity: 20,
    location: "Piano 2, Ala Ovest",
    description: "Ampia sala per conferenze con sistema audio/video.",
  },
  {
    id: "room-3",
    name: "Ufficio Progetti Gamma",
    capacity: 4,
    location: "Piano 3, Ala Nord",
    description: "Piccola sala per riunioni veloci o sessioni di brainstorming.",
  },
  {
    id: "room-4",
    name: "Sala Creativa Delta",
    capacity: 12,
    location: "Piano Terra, Area Comune",
    description: "Spazio flessibile con arredi modulari e pareti scrivibili.",
  },
];

export let mockBookings: Booking[] = [
  {
    id: "booking-1",
    roomId: "room-1",
    title: "Riunione Settimanale Team Marketing",
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    organizer: "Alice Rossi",
  },
  {
    id: "booking-2",
    roomId: "room-1",
    title: "Brainstorming Nuovo Prodotto",
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(15, 30, 0, 0)),
    organizer: "Marco Bianchi",
  },
  {
    id: "booking-3",
    roomId: "room-2",
    title: "Presentazione Trimestrale Clienti",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(12, 0, 0, 0)),
    organizer: "Giulia Verdi",
  },
  {
    id: "booking-4",
    roomId: "room-3",
    title: "Colloquio di Lavoro",
    startTime: new Date(new Date().setHours(16, 0, 0, 0)),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)),
    organizer: "Luca Neri",
  },
];

export const addBooking = (newBooking: Booking) => {
  mockBookings = [...mockBookings, newBooking];
  console.log("Nuova prenotazione aggiunta:", newBooking);
};

export const deleteBooking = (bookingId: string) => {
  mockBookings = mockBookings.filter(booking => booking.id !== bookingId);
  console.log("Prenotazione eliminata:", bookingId);
};

export const updateBooking = (updatedBooking: Booking) => {
  mockBookings = mockBookings.map(booking =>
    booking.id === updatedBooking.id ? updatedBooking : booking
  );
  console.log("Prenotazione aggiornata:", updatedBooking);
};