import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import ComparisonBar from "@/components/ComparisonBar";
import Index from "./pages/Index";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Projects from "./pages/Projects";
import Sell from "./pages/Sell";
import Development from "./pages/Development";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PropertyDetails from "./pages/PropertyDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ComparisonProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/development" element={<Development />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ComparisonBar />
          </BrowserRouter>
        </TooltipProvider>
      </ComparisonProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
