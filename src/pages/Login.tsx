"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Caricamento...</div>;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Accedi o Registrati</CardTitle>
          <CardDescription>Utilizza la tua email per accedere o creare un nuovo account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]} // Nessun provider di terze parti per ora
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="light" // Utilizza il tema light di Supabase UI
            redirectTo={window.location.origin} // Reindirizza alla root dopo l'autenticazione
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;