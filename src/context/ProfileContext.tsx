"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./SessionContext";
import { Profile } from "@/types";
import { showError } from "@/utils/toast";

interface ProfileContextType {
  profile: Profile | null;
  isLoadingProfile: boolean;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading: isLoadingSession } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, updated_at")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for new users
      console.error("Error fetching profile:", error);
      showError("Errore nel caricamento del profilo utente.");
      setProfile(null);
    } else if (data) {
      setProfile(data);
    } else {
      setProfile(null);
    }
    setIsLoadingProfile(false);
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isLoadingSession) {
      fetchProfile();
    }
  }, [fetchProfile, isLoadingSession]);

  const value = {
    profile,
    isLoadingProfile,
    fetchProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};