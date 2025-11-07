import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingFormPage from "./pages/BookingFormPage";
import EditBookingPage from "./pages/EditBookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import Layout from "./components/Layout";
import { BookingProvider } from "./context/BookingContext"; // Import BookingProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <BookingProvider> {/* Wrap with BookingProvider */}
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailsPage />} />
              <Route path="/rooms/:id/book" element={<BookingFormPage />} />
              <Route path="/rooms/:roomId/bookings/:bookingId/edit" element={<EditBookingPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;