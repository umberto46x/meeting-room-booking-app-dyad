import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, generateTimeSlots } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { showSuccess, showError } from "@/utils/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBookingFormSchema } from "@/lib/bookingValidation";
import { useBookings } from "@/context/BookingContext";
import BookedSlotsDisplay from "@/components/BookedSlotsDisplay"; // Import BookedSlotsDisplay

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
  const { rooms, bookings, addBooking } = useBookings();

  const room = rooms.find((r) => r.id === id);
  const roomId = id || '';

  const timeSlots = generateTimeSlots();

  const bookingFormSchema = createBookingFormSchema(roomId, undefined, bookings);

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

  const selectedDate = form.watch("date"); // Watch for changes in the selected date

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="container mx-auto">
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
                          disabled={(date) => date < today}
                          initialFocus
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedDate && (
                <BookedSlotsDisplay
                  roomId={roomId}
                  selectedDate={selectedDate}
                  allBookings={bookings}
                />
              )}
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
    </div>
  );
};

export default BookingFormPage;