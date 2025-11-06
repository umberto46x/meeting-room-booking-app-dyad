import React, { useState, useEffect } from "react";
import { mockBookings } from "@/data/mockData";
import { Booking } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingCard from "@/components/BookingCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Search } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast"; // Import toast functions

const MyBookingsPage: React.FC = () => {
  const [organizerFilter, setOrganizerFilter] = useState<string>("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Filter bookings based on organizerFilter
    const currentBookings = mockBookings.filter((booking) =>
      booking.organizer.toLowerCase().includes(organizerFilter.toLowerCase())
    );
    setFilteredBookings(currentBookings);
  }, [organizerFilter]);

  const handleDeleteBooking = (bookingId: string) => {
    try {
      // In un'applicazione reale, qui si farebbe una chiamata API per eliminare la prenotazione
      // Per ora, aggiorniamo direttamente mockBookings e poi lo stato locale
      const updatedBookings = mockBookings.filter(booking => booking.id !== bookingId);
      // Aggiorna mockBookings globalmente (simulando un'operazione di backend)
      // Nota: in un'app reale, mockBookings non sarebbe esportato come 'let' e modificato direttamente
      // ma si userebbe una funzione di mockData per aggiornarlo.
      // Per questo esempio, assumiamo che mockBookings venga aggiornato esternamente da deleteBooking
      // e poi ri-filtriamo per riflettere il cambiamento.
      
      // Chiamiamo la funzione deleteBooking dal mockData per aggiornare l'array globale
      // Questo è importante per mantenere la coerenza tra le pagine
      const { deleteBooking } = require("@/data/mockData");
      deleteBooking(bookingId);

      // Aggiorna lo stato locale per riflettere l'eliminazione
      setFilteredBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
      showSuccess("Prenotazione eliminata con successo!");
    } catch (error) {
      console.error("Errore durante l'eliminazione della prenotazione:", error);
      showError("Si è verificato un errore durante l'eliminazione della prenotazione.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Le mie Prenotazioni</h1>
      <div className="flex items-center space-x-2 mb-6 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Cerca per organizzatore..."
          value={organizerFilter}
          onChange={(e) => setOrganizerFilter(e.target.value)}
          className="flex-1"
        />
        <Button>
          <Search className="h-4 w-4 mr-2" /> Cerca
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onDelete={handleDeleteBooking} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">Nessuna prenotazione trovata per "{organizerFilter}".</p>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default MyBookingsPage;