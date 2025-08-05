import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Unsubscribe from "./pages/Unsubscribe";
import NewCampaign from "./pages/NewCampaign";
import Responses from "./pages/Responses";
import AllEmails from "./pages/AllEmails";
import Templates from "./pages/Templates";
import Campaigns from "./pages/Campaigns";
import Subscribers from "./pages/Subscribers";
import Unsubscribers from "./pages/Unsubscribers";
import FailedEmails from "./pages/FailedEmails";


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/campaigns/new" element={
              <ProtectedRoute>
                <NewCampaign />
              </ProtectedRoute>
            } />
            <Route path="/responses" element={
              <ProtectedRoute>
                <Responses />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            } />
            <Route path="/all-emails" element={
              <ProtectedRoute>
                <AllEmails />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="/subscribers" element={
              <ProtectedRoute>
                <Subscribers />
              </ProtectedRoute>
            } />
            <Route path="/unsubscribers" element={
              <ProtectedRoute>
                <Unsubscribers />
              </ProtectedRoute>
            } />
            <Route path="/failed-emails" element={
              <ProtectedRoute>
                <FailedEmails />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
