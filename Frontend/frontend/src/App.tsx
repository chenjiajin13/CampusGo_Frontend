import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role } from './types/role';

import Login from './pages/Login';
import OrdersPage from './pages/orders/OrderPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import MerchantsPage from './pages/merchants/MerchantsPage';
import RunnerPage from './pages/runner/RunnerPage';
import RunnerDashboard from './pages/runner/RunnerDashboard';
import AppShell from './components/AppShell';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={[Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="notifications" replace />} />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={[Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payments"
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN, Role.MERCHANT]}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={[Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="runner" element={<RunnerPage />} />
      </Route>

      <Route
        path="/runner"
        element={
          <ProtectedRoute allowedRoles={[Role.RUNNER, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RunnerDashboard />} />
      </Route>

      <Route
        path="/merchant"
        element={
          <ProtectedRoute allowedRoles={[Role.MERCHANT, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MerchantDashboard />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
