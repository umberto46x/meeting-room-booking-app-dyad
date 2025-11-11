"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, UserCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import { useSession } from "@/context/SessionContext";
import { useProfile } from "@/context/ProfileContext"; // Import useProfile
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel, // Import DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();
  const { session } = useSession();
  const { profile, isLoadingProfile } = useProfile(); // Use profile context

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Errore durante il logout:", error);
      showError("Si è verificato un errore durante il logout.");
    }
  };

  const userDisplayName = profile?.first_name || session?.user?.email || "Utente";
  const userFallback = profile?.first_name ? profile.first_name.charAt(0).toUpperCase() : (session?.user?.email ? session.user.email.charAt(0).toUpperCase() : "U");

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
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground relative">
                  {isLoadingProfile ? (
                    <UserCircle2 className="h-6 w-6" />
                  ) : (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={userDisplayName} />
                      <AvatarFallback>{userFallback}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="sr-only">Menu Utente</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : userDisplayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    Profilo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;