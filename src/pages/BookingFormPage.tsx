import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mockRooms, addBooking, mockBookings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateTimeSlots } from "@/lib/utils"; // Import generateTimeSlots
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

// Definizione manuale del tipo per i valori del form, poiché lo schema è dinamico
interface BookingFormValues {
  title: string;
  organizer: string;
  date: Date;
  startTime: string;
  endTime: string;
}

const BookingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const room = mockRooms.find((r) => r.id === id);
  const roomId = id || ''; // Assicurati che roomId sia sempre una stringa

  const timeSlots = generateTimeSlots(); // Genera gli slot orari

  // Sposta la definizione dello schema Zod all'interno del componente
  const bookingFormSchema = z.object({
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
    // Check for booking overlaps
    const { date, startTime, endTime } = data;

    const newBookingStart = new Date(date);
    const [newStartHour, newStartMinute] = startTime.split(':').map(Number);
    newBookingStart.setHours(newStartHour, newStartMinute, 0, 0);

    const newBookingEnd = new Date(date);
    const [newEndHour, newEndMinute] = endTime.split(':').map(Number);
    newBookingEnd.setHours(newEndHour, newEndMinute, 0, 0);

    // Filter existing bookings for the same room and date
    const existingBookingsForRoomAndDate = mockBookings.filter(
      (booking) =>
        booking.roomId === roomId && // Usa roomId direttamente dallo scope del componente
        format(booking.startTime, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    // Check for overlaps
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

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      title: "",
      organizer: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
    },
  });

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

  const onSubmit = (values: BookingFormValues) => {
    try {
      const startTime = new Date(values.date);
      const [startHour, startMinute] = values.startTime.split(':').map(Number);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(values.date);
      const [endHour, endMinute] = values.endTime.split(':').map(Number);
      endTime.setHours(endHour, endMinute, 0, 0);

      const newBooking = {
        id: `booking-${Date.now()}`,
        roomId: room.id,
        title: values.title,
        startTime,
        endTime,
        organizer: values.organizer,
      };

      addBooking(newBooking);
      showSuccess("Prenotazione effettuata con successo!");
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      console.error("Errore durante la prenotazione:", error);
      showError("Si è verificato un errore durante la prenotazione.");
    }
  };

  // Get today's date at midnight for disabling past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="container mx-auto p-4">
      <Link to={`/rooms/${room.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Torna ai Dettagli Stanza
      </Link>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Prenota {room.name}</CardTitle>
          <CardDescription className="text-lg">Compila il modulo per prenotare questa sala riunioni.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titolo della Prenotazione</FormLabel>
                    <FormControl>
                      <Input placeholder="Riunione di Progetto X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizzatore</FormLabel>
                    <FormControl>
                      <Input placeholder="Il tuo nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: it })
                            ) : (
                              <span>Seleziona una data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < today} // Disable dates before today (midnight)
                          initialFocus
                          locale={it} // Explicitly set locale
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ora di Inizio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona ora di inizio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ora di Fine</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona ora di fine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">Conferma Prenotazione</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default BookingFormPage;