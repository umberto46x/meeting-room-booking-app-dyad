"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          showSuccess("Accesso effettuato con successo!");
          navigate("/"); // Redirect to home after sign in
        } else if (event === 'SIGNED_OUT') {
          showSuccess("Disconnessione effettuata.");
          navigate("/login"); // Redirect to login after sign out
        } else if (event === 'INITIAL_SESSION' && !currentSession) {
          navigate("/login"); // Redirect to login if no initial session
        }
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (!session) {
        navigate("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    session,
    isLoading,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};