"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react"; // Import LogOut icon
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import { useSession } from "@/context/SessionContext"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { showError } from "@/utils/toast"; // Import showError

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();
  const { session } = useSession(); // Get session from context

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il logout:", error);
      showError("Si è verificato un errore durante il logout.");
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md fixed w-full top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-primary-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <Link to="/" className="text-2xl font-bold">
          Booking App
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {session && ( // Show logout button only if session exists
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground">
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;