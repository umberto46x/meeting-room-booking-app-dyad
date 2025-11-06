import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Booking App
        </Link>
        <div className="space-x-4">
          <Link to="/"> {/* Nuovo link Home */}
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
              Home
            </Button>
          </Link>
          <Link to="/rooms">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
              Sale Riunioni
            </Button>
          </Link>
          <Link to="/my-bookings">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
              Le mie Prenotazioni
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;