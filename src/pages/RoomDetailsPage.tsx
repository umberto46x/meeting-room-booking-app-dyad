import React from "react";
import { useParams, Link } from "react-router-dom";
import { mockRooms, mockBookings } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, ArrowLeft } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import BookingCard from "@/components/BookingCard"; // Import the new BookingCard component

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const room = mockRooms.find((r) => r.id === id);
  const roomBookings = mockBookings.filter((booking) => booking.roomId === id);

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
        <MadeWithDyad />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
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

          <h2 className="text-2xl font-semibold mt-6 mb-4">Prossime Prenotazioni</h2>
          {roomBookings.length > 0 ? (
            <div className="space-y-4">
              {roomBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nessuna prenotazione per questa stanza al momento.</p>
          )}
          
          <Button className="w-full mt-6">Prenota questa Stanza</Button>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default RoomDetailsPage;