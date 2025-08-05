// import "./global.css";

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { LinkedInSetupPage } from "./pages/LinkedInSetupPage";
import { DashboardPage } from "./pages/DashboardPage";
import LeadFiltersPage from "./pages/LeadFiltersPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LeadDataPage } from "./pages/LeadDataPage";
import { WorkflowPage } from "./pages/WorkflowPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Toaster } from "./components/leadui/toaster";
console.log("Toaster", Toaster);
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LeadIntelligence from "./pages/LeadIntelligence";
// import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// function LeadIntelligence() {
//   return <div>Lead Intelligence Page</div>;
// }

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/linkedin-setup" element={<LinkedInSetupPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lead-filters"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <LeadFiltersPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <HistoryPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lead-data"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <LeadDataPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workflow"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <WorkflowPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              {/* Newly Added Routes from 2nd App */}
              {/* <Route path="/lead-intelligence" element={<LeadIntelligence />} /> */}
              <Route
                path="/lead-intelligence/:userId"
                element={<LeadIntelligence />}
              />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
