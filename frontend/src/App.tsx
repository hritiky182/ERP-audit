import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeEffect } from "./components/layout/ThemeEffect";
import { Toaster } from "./components/ui/sonner";

import LoginPage from "./routes/login";
import ForbiddenPage from "./routes/403";
import AppLayout from "./routes/_app";
import DashboardPage from "./routes/_app.dashboard";
import FindingsPage from "./routes/_app.findings";
import PaymentsPage from "./routes/_app.payments";
import JournalsPage from "./routes/_app.journals";
import VendorsPage from "./routes/_app.vendors";
import UsersPage from "./routes/_app.users";
import SoDPage from "./routes/_app.sod";
import ChangesPage from "./routes/_app.changes";
import ReportsPage from "./routes/_app.reports";
import SettingsPage from "./routes/_app.settings";
import NotFound from "./components/common/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeEffect />
        <Routes>
          {/* Public / Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Protected routes wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/journals" element={<JournalsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/sod" element={<SoDPage />} />
            <Route path="/changes" element={<ChangesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Redirect / to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch-all 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
