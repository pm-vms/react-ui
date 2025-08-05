import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, LoginPage, LinkedInSetupPage } from "../modules/auth";
import { DashboardPage } from "../modules/dashboard";
import { LeadFiltersPage, HistoryPage, LeadDataPage, LeadIntelligence } from "../modules/leads";
import { WorkflowPage, SettingsPage } from "../modules/settings";
import { ProfilePage } from "../modules/profile";
import { DashboardLayout } from "../layout/DashboardLayout";

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
