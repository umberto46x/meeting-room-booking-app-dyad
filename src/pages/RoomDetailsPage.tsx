import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, ArrowLeft, XCircle } from "lucide-react";
import BookingCard from "@/components/BookingCard";
import { Booking } from "@/types";
import RoomCalendar from "@/components/RoomCalendar";
import { format, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import NoContentFound from "@/components/NoContentFound";
import { useBookings } from "@/context/BookingContext"; // Import useBookings

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { rooms, bookings } = useBookings(); // Use rooms and bookings from context

  const room = rooms.find((r) => r.id === id);

  const [currentRoomBookings, setCurrentRoomBookings] = useState<Booking[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (id) {
      setCurrentRoomBookings(bookings.filter((booking) => booking.roomId === id));
    }
  }, [id, bookings]); // Depend on bookings from context

  const handleClearDateSelection = () => {
    setSelectedCalendarDate(undefined);
  };

  if (!room) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Stanza non trovata</h1>
        <p className="text-lg text-gray-600">La sala riunioni che stai cercando non esiste.</p>
        <Link to="/rooms">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Torna alle Sale
          </Button>
        </Link>
      </div>
    );
  }

  const bookingsToDisplay = selectedCalendarDate
    ? currentRoomBookings.filter((booking) => isSameDay(booking.startTime, selectedCalendarDate))
    : currentRoomBookings;

  return (
    <div className="container mx-auto">
      <Link to="/rooms" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Torna alle Sale
      </Link>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{room.name}</CardTitle>
          <CardDescription className="text-lg">{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Capacità: {room.capacity} persone</span>
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{room.location}</span>
          </div>

          <Link to={`/rooms/${room.id}/book`}>
            <Button className="w-full mt-6">Prenota questa Stanza</Button>
          </Link>

          <RoomCalendar
            bookings={currentRoomBookings}
            selectedDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
          />

          <h2 className="text-2xl font-semibold mt-6 mb-4 flex items-center justify-between">
            {selectedCalendarDate ? (
              <>
                Prenotazioni per il {format(selectedCalendarDate, "PPP", { locale: it })}
                <Button variant="ghost" size="sm" onClick={handleClearDateSelection}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancella selezione
                </Button>
              </>
            ) : (
              "Tutte le Prossime Prenotazioni"
            )}
          </h2>
          {bookingsToDisplay.length > 0 ? (
            <div className="space-y-4">
              {bookingsToDisplay.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <NoContentFound
              message={
                selectedCalendarDate
                  ? `Nessuna prenotazione per il ${format(selectedCalendarDate, "PPP", { locale: it })}.`
                  : "Nessuna prenotazione per questa stanza al momento."
              }
              linkTo={`/rooms/${room.id}/book`}
              linkText="Prenota ora"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetailsPage;