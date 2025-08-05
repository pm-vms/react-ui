import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./modules/auth/services/AuthContext";
import { AppRoutes } from "./routes";
import { Toaster } from "./shared/components/toaster";
import { Toaster as Sonner } from "./shared/components/sonner";
import { TooltipProvider } from "./shared/components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

console.log("Toaster", Toaster);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
