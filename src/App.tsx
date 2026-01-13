import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
import AdvancedSearch from "./pages/AdvancedSearch";
import Auth from "./pages/Auth";
import VendorDashboard from "./pages/VendorDashboard";
import PropertyValuation from "./pages/PropertyValuation";
import ValuationHistory from "./pages/ValuationHistory";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./components/admin/AdminOverview";
import AdminPropertyManagement from "./components/admin/AdminPropertyManagement";
import AdminUserManagement from "./components/admin/AdminUserManagement";
import AdminRoleManagement from "./components/admin/AdminRoleManagement";
import AdminDevelopmentProjects from "./components/admin/AdminDevelopmentProjects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <ComparisonProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                
                {/* Admin Routes with Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="properties" element={<AdminPropertyManagement />} />
                  <Route path="development" element={<AdminDevelopmentProjects />} />
                  <Route path="users" element={<AdminUserManagement />} />
                  <Route path="roles" element={<AdminRoleManagement />} />
                </Route>
                
                <Route path="/buy" element={<Buy />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/development" element={<Development />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/search" element={<AdvancedSearch />} />
                <Route path="/valuation" element={<PropertyValuation />} />
                <Route path="/valuation/history" element={<ValuationHistory />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ComparisonBar />
            </BrowserRouter>
          </TooltipProvider>
        </ComparisonProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
