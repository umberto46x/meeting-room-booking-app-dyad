import React, { useEffect, useState, useCallback } from "react";
import { mockBookings, subscribeToBookings } from "@/data/mockData";
import { Booking } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import cn utility

interface UpcomingBookingsProps {
  className?: string; // Add className prop
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ className }) => {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  const updateUpcomingBookings = useCallback(() => {
    const now = new Date();
    const filteredBookings = mockBookings
      .filter((booking) => booking.endTime > now) // Only show bookings that haven't ended yet
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()); // Sort by start time ascending
    setUpcomingBookings(filteredBookings);
  }, []); // No dependencies, as mockBookings is accessed directly

  useEffect(() => {
    updateUpcomingBookings(); // Initial load
    const unsubscribe = subscribeToBookings(updateUpcomingBookings); // Subscribe to global mockBookings changes
    return () => unsubscribe(); // Cleanup subscription
  }, [updateUpcomingBookings]); // Depends on the memoized callback

  return (
    <Card className={cn("w-full max-w-2xl mx-auto mt-8", className)}> {/* Apply className here */}
      <CardHeader>
        <CardTitle className="text-2xl">Prossime Prenotazioni</CardTitle>
        <CardDescription>Le tue prenotazioni in arrivo.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="border rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="font-semibold text-lg">{booking.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(booking.startTime, "PPP", { locale: it })}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(booking.startTime, "p", { locale: it })} - {format(booking.endTime, "p", { locale: it })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Organizzatore: {booking.organizer}</span>
                  </div>
                </div>
                <Link to={`/rooms/${booking.roomId}`} className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <Button variant="outline" size="sm">
                    Visualizza Dettagli Stanza
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Nessuna prenotazione in arrivo.</p>
        )}
        <div className="mt-6 text-center">
          <Link to="/my-bookings">
            <Button>Visualizza Tutte le Prenotazioni</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;