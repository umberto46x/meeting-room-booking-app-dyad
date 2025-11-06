import React from "react";
import { Booking } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl">{booking.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};

export default BookingCard;