import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Benvenuto nell'App di Prenotazione Sale Riunioni</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Usa la barra di navigazione per esplorare le sale e le tue prenotazioni.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;