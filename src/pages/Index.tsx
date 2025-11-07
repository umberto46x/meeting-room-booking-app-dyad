import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UpcomingBookings from "@/components/UpcomingBookings";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4">Benvenuto nell'App di Prenotazione Sale Riunioni</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          La tua soluzione semplice e veloce per trovare e prenotare la sala riunioni perfetta.
          Esplora le nostre sale disponibili, visualizza i dettagli e gestisci le tue prenotazioni con facilità.
        </p>
        <Link to="/rooms">
          <Button size="lg" className="mt-4">
            Esplora le Sale Riunioni
          </Button>
        </Link>
      </div>
      <UpcomingBookings className="mt-8" />
    </div>
  );
};

export default Index;