import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";
import LoginPage from "../modules/auth/pages/LoginPage";
import LinkedInSetupPage from "../modules/auth/pages/LinkedInSetupPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import LeadFiltersPage from "../modules/leads/pages/LeadFiltersPage";
import HistoryPage from "../modules/leads/pages/HistoryPage";
import LeadDataPage from "../modules/leads/pages/LeadDataPage";
import LeadIntelligence from "../modules/leads/pages/LeadIntelligence";
import WorkflowPage from "../modules/settings/pages/WorkflowPage";
import SettingsPage from "../modules/settings/pages/SettingsPage";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import DashboardLayout from "../layout/DashboardLayout";

export const AppRoutes: React.FC = () => {
  return (
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
      <Route
        path="/lead-intelligence/:userId"
        element={<LeadIntelligence />}
      />
    </Routes>
  );
};
