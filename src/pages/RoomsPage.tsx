import React from "react";
import RoomCard from "@/components/RoomCard";
import { useBookings } from "@/context/BookingContext"; // Import useBookings

const RoomsPage: React.FC = () => {
  const { rooms } = useBookings(); // Use rooms from context

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Sale Riunioni Disponibili</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;