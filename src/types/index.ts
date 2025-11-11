export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string; // e.g., "Floor 1, Room A"
  description?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string; // Added userId to link booking to the user
  title: string;
  startTime: Date;
  endTime: Date;
  organizer: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}