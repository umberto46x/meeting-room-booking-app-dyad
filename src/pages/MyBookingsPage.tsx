import React, { useState, useEffect, useCallback } from "react";
import { Booking } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookingCard from "@/components/BookingCard";
import { Search, CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { it } from "date-fns/locale";
import NoContentFound from "@/components/NoContentFound";
import { useBookings } from "@/context/BookingContext"; // Import useBookings

const MyBookingsPage: React.FC = () => {
  const { bookings } = useBookings(); // Use bookings from context
  const [organizerFilter, setOrganizerFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("dateAsc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filteredAndSortedBookings, setFilteredAndSortedBookings] = useState<Booking[]>([]);

  const applyFiltersAndSort = useCallback(() => {
    let currentBookings = [...bookings]; // Use bookings from context

    // 1. Filter by organizer
    if (organizerFilter) {
      currentBookings = currentBookings.filter((booking) =>
        booking.organizer.toLowerCase().includes(organizerFilter.toLowerCase())
      );
    }

    // 2. Filter by date range
    if (dateRange?.from) {
      currentBookings = currentBookings.filter((booking) => {
        const bookingDate = booking.startTime;
        const from = dateRange.from ? startOfDay(dateRange.from) : null;
        const to = dateRange.to ? endOfDay(dateRange.to) : null;

        if (from && to) {
          return isWithinInterval(bookingDate, { start: from, end: to });
        } else if (from) {
          return bookingDate >= from;
        }
        return true;
      });
    }

    // 3. Sort bookings
    currentBookings.sort((a, b) => {
      if (sortBy === "dateAsc") {
        return a.startTime.getTime() - b.startTime.getTime();
      }
      if (sortBy === "dateDesc") {
        return b.startTime.getTime() - a.startTime.getTime();
      }
      if (sortBy === "roomNameAsc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "roomNameDesc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    setFilteredAndSortedBookings(currentBookings);
  }, [bookings, organizerFilter, sortBy, dateRange]); // Add bookings to dependencies

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleClearDateFilter = () => {
    setDateRange(undefined);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Le mie Prenotazioni</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 max-w-3xl mx-auto">
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Cerca per organizzatore..."
            value={organizerFilter}
            onChange={(e) => setOrganizerFilter(e.target.value)}
            className="pr-10 w-full"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full sm:w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y", { locale: it })} -{" "}
                    {format(dateRange.to, "LLL dd, y", { locale: it })}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y", { locale: it })
                )
              ) : (
                <span>Seleziona un intervallo di date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={it}
            />
          </PopoverContent>
        </Popover>
        <Select onValueChange={setSortBy} defaultValue={sortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordina per..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateAsc">Data (crescente)</SelectItem>
            <SelectItem value="dateDesc">Data (decrescente)</SelectItem>
            <SelectItem value="roomNameAsc">Nome Sala (A-Z)</SelectItem>
            <SelectItem value="roomNameDesc">Nome Sala (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setOrganizerFilter(""); handleClearDateFilter(); }} variant="outline" className="w-full sm:w-auto">
          Reset Filtri
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedBookings.length > 0 ? (
          filteredAndSortedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <NoContentFound
            message="Nessuna prenotazione trovata con i filtri attuali."
            linkTo="/rooms"
            linkText="Esplora le Sale Riunioni"
            className="col-span-full"
          />
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;